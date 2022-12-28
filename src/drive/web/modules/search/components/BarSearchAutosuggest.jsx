import React, { useState, useMemo } from 'react'
import Autosuggest from 'react-autosuggest'
import cx from 'classnames'

import { useClient, models } from 'cozy-client'

import { highlightQueryTerms } from 'drive/web/modules/search/components/helpers'
import styles from 'drive/web/modules/search/components/styles.styl'
import BarSearchInputGroup from 'drive/web/modules/search/components/BarSearchInputGroup'
import useSearch from 'drive/web/modules/search/hooks/useSearch'

const BarSearchAutosuggest = ({ t }) => {
  const client = useClient()
  const {
    suggestions,
    fetchSuggestions,
    hasSuggestions,
    clearSuggestions,
    isBusy,
    query
  } = useSearch()

  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState('')

  const theme = useMemo(
    () => ({
      container: cx(
        styles['coz-searchbar-autosuggest-container'],
        isBusy ? styles['--searching'] : '',
        focused ? styles['--focused'] : ''
      ),
      input: styles['coz-searchbar-autosuggest-input'],
      inputFocused: styles['coz-searchbar-autosuggest-input-focused'],
      suggestionsContainer:
        styles['coz-searchbar-autosuggest-suggestions-container'],
      suggestionsContainerOpen:
        styles['coz-searchbar-autosuggest-suggestions-container--open'],
      suggestionsList: styles['coz-searchbar-autosuggest-suggestions-list'],
      suggestion: styles['coz-searchbar-autosuggest-suggestion'],
      suggestionHighlighted:
        styles['coz-searchbar-autosuggest-suggestion-highlighted'],
      sectionTitle: styles['coz-searchbar-autosuggest-section-title']
    }),
    [isBusy, focused]
  )

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value)
  }
  const onSuggestionsClearRequested = () => {
    clearSuggestions()
  }

  const onSuggestionSelected = async (event, { suggestion }) => {
    // `onSelect` is a string that describes what should happen when the suggestion is selected. Currently, the only format we're supporting is `open:http://example.com` to change the url of the current page.
    const onSelect = suggestion.onSelect

    if (/^id_note:/.test(onSelect)) {
      const url = await models.note.fetchURL(client, {
        id: onSelect.substr(8)
      })
      window.location.href = url
    } else if (/^open:/.test(onSelect)) {
      window.location.href = onSelect.substr(5)
    } else {
      // eslint-disable-next-line no-console
      console.log(
        'suggestion onSelect (' + onSelect + ') could not be executed'
      )
    }
    clearSuggestions()
    setInput('')
  }

  // We want the user to find folders in which he can then navigate into, so we return the path here
  const getSuggestionValue = suggestion => suggestion.subtitle

  const renderSuggestion = suggestion => {
    return (
      <div className={styles['coz-searchbar-autosuggest-suggestion-item']}>
        {suggestion.icon && (
          <img
            className={styles['coz-searchbar-autosuggest-suggestion-icon']}
            src={suggestion.icon}
            alt="icon"
          />
        )}
        <div className={styles['coz-searchbar-autosuggest-suggestion-content']}>
          <div className={styles['coz-searchbar-autosuggest-suggestion-title']}>
            {highlightQueryTerms(suggestion.title, query)}
          </div>
          {suggestion.subtitle && (
            <div
              className={
                styles['coz-searchbar-autosuggest-suggestion-subtitle']
              }
            >
              {highlightQueryTerms(suggestion.subtitle, query)}
            </div>
          )}
        </div>
      </div>
    )
  }

  const inputProps = {
    placeholder: t('searchbar.placeholder'),
    value: input,
    onChange: (event, { newValue }) => {
      setInput(newValue)
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }

  const renderInputComponent = inputProps => (
    <BarSearchInputGroup isBusy={isBusy} isFocus={focused}>
      <input {...inputProps} />
    </BarSearchInputGroup>
  )

  const isSearchEmpty = query !== '' && focused && !hasSuggestions && !isBusy

  return (
    <div className={styles['bar-search-container']} role="search">
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        focusInputOnSuggestionClick={false}
      />
      {isSearchEmpty && (
        <div className={styles['coz-searchbar-autosuggest-status-container']}>
          {t('searchbar.empty', { query })}
        </div>
      )}
    </div>
  )
}

export default BarSearchAutosuggest
