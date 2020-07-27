import React, { useCallback, useContext } from 'react'

import { ThumbnailSizeContext } from 'drive/lib/ThumbnailSizeContext'
import { models, useClient, Q } from 'cozy-client'
import { useDispatch } from 'react-redux'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { FileList } from 'drive/web/modules/filelist/FileList'
import { ConnectedFileListBody as FileListBody } from 'drive/web/modules/filelist/FileListBody'
import AddFolder from 'drive/web/modules/filelist/AddFolder'
import FileListHeader from 'drive/web/modules/filelist/FileListHeader'
import MobileFileListHeader from 'drive/web/modules/filelist/MobileFileListHeader'
import Oops from 'components/Error/Oops'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import { isMobileApp } from 'cozy-device-helper'
import LoadMore from 'drive/web/modules/filelist/LoadMoreV2'
import { FileWithSelection as File } from 'drive/web/modules/filelist/File'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import { TRASH_DIR_ID } from 'drive/constants/config'
import { openLocalFile } from 'drive/mobile/modules/offline/duck'

const FolderViewBody = ({
  currentFolderId,
  queryResults,
  actions,
  canSort,
  canUpload = true,
  withFilePath = false,
  navigateToFolder,
  navigateToFile,
  refreshFolderContent = null
}) => {
  const { isBigThumbnail, toggleThumbnailSize } = useContext(
    ThumbnailSizeContext
  )
  const [sortOrder, setSortOrder] = useFolderSort(currentFolderId)

  const changeSortOrder = useCallback((folderId_legacy, attribute, order) =>
    setSortOrder({ sortAttribute: attribute, sortOrder: order })
  )

  const dispatch = useDispatch()
  const client = useClient()

  const handleFileOpen = useCallback(
    async (file, availableOffline) => {
      if (availableOffline) {
        return dispatch(openLocalFile(file))
      }

      const isNote = models.file.isNote(file)
      const isShortcut = models.file.isShortcut(file)

      //Should only be called if mobile
      if (isShortcut) {
        const resp = await client.query(
          Q('io.cozy.files.shortcuts').getById(file.id)
        )
        window.location.href = resp.data.attributes.url
      } else if (isNote) {
        try {
          window.location.href = await models.note.fetchURL(client, file)
        } catch (e) {
          Alerter.error('alert.offline')
        }
      } else {
        navigateToFile(file)
      }
    },
    [dispatch, client]
  )

  const isInError = queryResults.some(query => query.fetchStatus === 'error')

  const hasDataToShow =
    !isInError &&
    queryResults.some(query => query.data && query.data.length > 0)
  const isLoading =
    !hasDataToShow &&
    queryResults.some(
      query => query.fetchStatus === 'loading' && !query.lastUpdate
    )

  const isEmpty = !isInError && !isLoading && !hasDataToShow

  return (
    <>
      <SelectionBar actions={actions} />
      <FileList>
        {hasDataToShow && (
          <>
            <MobileFileListHeader
              folderId={null}
              canSort={canSort}
              sort={sortOrder}
              onFolderSort={changeSortOrder}
              thumbnailSizeBig={isBigThumbnail}
              toggleThumbnailSize={toggleThumbnailSize}
            />
            <FileListHeader
              folderId={null}
              canSort={canSort}
              sort={sortOrder}
              onFolderSort={changeSortOrder}
              thumbnailSizeBig={isBigThumbnail}
              toggleThumbnailSize={toggleThumbnailSize}
            />
          </>
        )}
        <FileListBody selectionModeActive={false}>
          <AddFolder refreshFolderContent={refreshFolderContent} />
          {isInError && <Oops />}
          {isLoading && <FileListRowsPlaceholder />}
          {/* TODO FolderViewBody should not have the responsability to chose 
          which empty component to display. It should be done by the "view" itself. 
          But adding a new prop like <FolderViewBody emptyComponent={} 
          is not good enought too */}
          {isEmpty &&
            currentFolderId !== TRASH_DIR_ID && (
              <EmptyDrive canUpload={canUpload} />
            )}
          {isEmpty &&
            currentFolderId === TRASH_DIR_ID && (
              <EmptyTrash canUpload={canUpload} />
            )}
          {hasDataToShow && (
            <div className={isMobileApp() ? 'u-ov-hidden' : ''}>
              {queryResults.map((query, queryIndex) => (
                <React.Fragment key={queryIndex}>
                  {query.data.map(file => (
                    <File
                      key={file._id}
                      attributes={file}
                      displayedFolder={null}
                      withSelectionCheckbox={true}
                      withSharedBadge={true}
                      isFlatDomain={true}
                      onFolderOpen={navigateToFolder}
                      onFileOpen={handleFileOpen}
                      withFilePath={withFilePath}
                      thumbnailSizeBig={isBigThumbnail}
                      actions={actions}
                      refreshFolderContent={refreshFolderContent}
                    />
                  ))}
                  {query.hasMore && <LoadMore fetchMore={query.fetchMore} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </FileListBody>
      </FileList>
    </>
  )
}

export default FolderViewBody
