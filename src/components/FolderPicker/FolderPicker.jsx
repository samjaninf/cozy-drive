import React, { useState } from 'react'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { FolderPickerBody } from 'components/FolderPicker/FolderPickerBody'
import { FolderPickerFooter } from 'components/FolderPicker/FolderPickerFooter'
import { FolderPickerHeader } from 'components/FolderPicker/FolderPickerHeader'
import { FolderPickerTopbar } from 'components/FolderPicker/FolderPickerTopbar'

const useStyles = makeStyles(() => ({
  paper: {
    height: '100%',
    '& .MuiDialogContent-root': {
      padding: '0'
    },
    '& .MuiDialogTitle-root': {
      padding: '0'
    }
  }
}))

const FolderPicker = ({
  currentFolder,
  entries,
  onConfirm,
  onClose,
  isBusy,
  canCreateFolder = true,
  slotProps,
  showNextcloudFolder = false
}) => {
  const [folder, setFolder] = useState(currentFolder)

  const [isFolderCreationDisplayed, setFolderCreationDisplayed] =
    useState(false)
  const classes = useStyles()

  const showFolderCreation = () => {
    setFolderCreationDisplayed(true)
  }

  const hideFolderCreation = () => {
    setFolderCreationDisplayed(false)
  }

  const navigateTo = folder => {
    setFolder(folder)
    setFolderCreationDisplayed(false)
  }

  return (
    <React.Fragment>
      <FixedDialog
        className="u-p-0"
        open
        onClose={onClose}
        size="large"
        classes={{
          paper: classes.paper
        }}
        title={
          <>
            <FolderPickerHeader entries={entries} {...slotProps?.header} />
            <FolderPickerTopbar
              navigateTo={navigateTo}
              folder={folder}
              canCreateFolder={canCreateFolder}
              showFolderCreation={showFolderCreation}
              showNextcloudFolder={showNextcloudFolder}
            />
          </>
        }
        content={
          <FolderPickerBody
            folder={folder}
            navigateTo={navigateTo}
            entries={entries}
            isFolderCreationDisplayed={isFolderCreationDisplayed}
            hideFolderCreation={hideFolderCreation}
          />
        }
        actions={
          <FolderPickerFooter
            onConfirm={onConfirm}
            onClose={onClose}
            targets={entries}
            folder={folder}
            isBusy={isBusy}
            {...slotProps?.footer}
          />
        }
      />
    </React.Fragment>
  )
}

export { FolderPicker }
