import React, { useState } from 'react'

import { useQuery } from 'cozy-client'
import { NavDesktopLimiter } from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import { NavItem } from 'modules/navigation/NavItem'
import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'
import { UseSharedDrivesQuery } from 'modules/views/Folder/types'

interface SharedDrivesProps {
  actions: unknown[]
  handleFileOpen?: (path: string) => void
  navigateToFolder: (path: string) => void
  isFlatDomain: boolean
}

export const SharedDrives = ({
  handleFileOpen,
  navigateToFolder
}: SharedDrivesProps): JSX.Element | null => {
  const { isMobile } = useBreakpoints()
  const sharedDrivesQuery = buildSharedDrivesQuery()
  const { data } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  ) as UseSharedDrivesQuery
  const clickState = useState(null)
  const { t } = useI18n()

  if (!data || data.length === 0) return null

  return isMobile ? (
    <FileList>
      <FileListBody>
        <div className="u-ov-hidden">
          <>
            {data.map(file => (
              <File
                key={file.id}
                attributes={file}
                withSelectionCheckbox={false}
                onFolderOpen={navigateToFolder}
                onFileOpen={handleFileOpen}
                isInSyncFromSharing={false}
                disableSelection={true}
                isExternalDrive={file.attributes?.type === 'shortcut'}
              />
            ))}
          </>
        </div>
      </FileListBody>
    </FileList>
  ) : (
    <NavDesktopLimiter
      className="u-p-0"
      showMoreString={t('Nav.view_more')}
      showLessString={t('Nav.view_less')}
    >
      <NavItem
        secondary
        forcedLabel={t('Nav.item_my_drive')}
        clickState={clickState}
        to="/"
      />
      {data.map(file => (
        <NavItem
          key={file._id}
          secondary
          forcedLabel={file.name.replace(/\.url$/, '')}
          clickState={clickState}
          isExternalDrive={file.attributes?.type === 'shortcut'}
          to={`/external/${file._id}`}
        />
      ))}
    </NavDesktopLimiter>
  )
}