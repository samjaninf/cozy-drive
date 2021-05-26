import React from 'react'

import { isMobileApp } from 'cozy-device-helper'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'
import Typography from 'cozy-ui/transpiled/react/Typography'

import ScanWrapper from 'drive/web/modules/drive/Toolbar/components/ScanWrapper'
import AddFolderItem from 'drive/web/modules/drive/Toolbar/components/AddFolderItem'
import CreateNoteItem from 'drive/web/modules/drive/Toolbar/components/CreateNoteItem'
import CreateShortcut from 'drive/web/modules/drive/Toolbar/components/CreateShortcut'
import UploadItem from 'drive/web/modules/drive/Toolbar/components/UploadItem'
import StartScanner from 'drive/web/modules/drive/Toolbar/components/StartScanner'

export const ActionMenuContent = ({
  isDisabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <>
      {isMobile && (
        <>
          <Typography variant="h6" className="u-p-1">
            {t('toolbar.menu_add')}
          </Typography>
          <hr />
        </>
      )}
      {canCreateFolder && <AddFolderItem />}
      <CreateNoteItem />
      <CreateShortcut onCreated={refreshFolderContent} />
      {canUpload && <hr />}
      {canUpload && (
        <UploadItem disabled={isDisabled} onUploaded={refreshFolderContent} />
      )}
      {isMobileApp() && canUpload && <StartScanner disabled={isDisabled} />}
    </>
  )
}

const AddMenu = ({
  anchorRef,
  handleClose,
  isDisabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent
}) => {
  return (
    <ScanWrapper>
      <ActionMenu
        anchorElRef={anchorRef}
        onClose={handleClose}
        autoclose={true}
        popperOptions={{
          strategy: 'fixed'
        }}
      >
        <ActionMenuContent
          isDisabled={isDisabled}
          canCreateFolder={canCreateFolder}
          canUpload={canUpload}
          refreshFolderContent={refreshFolderContent}
        />
      </ActionMenu>
    </ScanWrapper>
  )
}

export default AddMenu