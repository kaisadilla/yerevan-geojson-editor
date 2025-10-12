import { TextInput, Tooltip } from '@mantine/core';
import { LockSimpleIcon, WarningIcon } from '@phosphor-icons/react';
import { type MapperElement } from 'models/MapDocument';
import { useDispatch } from 'react-redux';
import useMapEditorDoc from 'state/mapEditor/useDoc';
import styles from './PropertiesTable.module.scss';

export interface PropertiesTableProps {
  element: MapperElement;
}

function PropertiesTable ({
  element,
}: PropertiesTableProps) {
  const doc = useMapEditorDoc();
  const dispatch = useDispatch();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <td>Key</td>
          <td>Value</td>
        </tr>
      </thead>
      <tbody>
        {/*Object.keys(element.properties).map((key, i) => {
          let displayKey = key;
          let duplicate = displayKey.startsWith(LEAFLYS_PROP_DUPLICATE_KEY_PREFIX);
          let error: string | undefined = undefined;

          // If the key is encoded as a duplicate of another key, retrieve the
          // original key.
          if (duplicate) {
            const rx = new RegExp(`^${LEAFLYS_PROP_DUPLICATE_KEY_PREFIX}(.+?)\``);
            const match = key.match(rx)
            
            displayKey = match ? match[1] : key;
            error = "Duplicate key.";
          }
          // If the key is Leaflys metadata, ignore it.
          else if (key.startsWith(LEAFLYS_PROP_PREFIX)) {
            return null;
          }

          return <_PropRow
            key={i}
            name={displayKey}
            readOnlyKey={key === "name" || key === 'id'}
            keyError={error}
            value={element.properties[key]}
            onChangeKey={v => handleChangeKey(key, v)}
            onChangeValue={v => handleChangeValue(key, v)}
          />
        })*/}
        <tr>
          <td>
            <TextInput
              key={Object.keys(element.properties).length}
              classNames={{
                root: styles.inputRoot,
                input: styles.input,
              }}
              value={""}
              size='xs'
              data-key={true}
              onChange={evt => handleNewField(evt.target.value)}
            />
          </td>
          <td />
        </tr>
      </tbody>
    </table>
  );

  function handleChangeKey (old: string, newKey: string) {
    //dispatch(MapEditorDocActions.renameProperty({
    //  elementId: element.properties.id,
    //  key: old,
    //  newKey,
    //}));
  }

  function handleChangeValue (key: string, value: string) {
    // // When editing the element's id, we can't give it an id already in use.
    // if (key === "id" && doc.idExists(value)) return;
    // // When editing the element's id, we have to change anything that is
    // // referencing that element's current id.
    // if (key === "id" && doc.selectedId === element.properties.id) {
    //   dispatch(MapEditorDocActions.setSelected(value));
    // }
// 
    // dispatch(MapEditorDocActions.setProperty({
    //   elementId: element.properties.id,
    //   key,
    //   value,
    // }));
  }
  
  function handleNewField (key: string) {
    // // We don't allow using Leaflys' reserved prefix.
    // if (key.startsWith(LEAFLYS_PROP_PREFIX)) return;
// 
    // key = getSafeKey(key);
// 
    // dispatch(MapEditorDocActions.setProperty({
    //   elementId: element.properties.id,
    //   key,
    //   value: ""
    // }));
  }
}

interface _PropRowProps {
  name: string;
  value?: string;
  readOnlyKey?: boolean;
  keyError?: string;
  onChangeKey?: (value: string) => void;
  onChangeValue?: (value: string) => void;
}

function _PropRow ({
  name,
  value,
  readOnlyKey = false,
  keyError,
  onChangeKey,
  onChangeValue,
}: _PropRowProps) {
  return (
    <tr>
      <td>
        <div>
          {readOnlyKey && <LockSimpleIcon
            className={styles.lockIcon}
            size={16}
            weight='thin'
          />}
          <TextInput
            classNames={{
              root: styles.inputRoot,
              input: styles.input,
            }}
            value={name}
            size='xs'
            readOnly={readOnlyKey}
            data-key={true}
            data-has-error={keyError !== undefined}
            onChange={evt => onChangeKey?.(evt.target.value)}
          />
          {keyError && <Tooltip
            label={keyError}
          >
            <WarningIcon
              className={styles.errorIcon}
              size={24}
            />
          </Tooltip>}
        </div>
      </td>
      <td>
        <div>
          <TextInput
            classNames={{
              root: styles.inputRoot,
              input: styles.input,
            }}
            value={value}
            size='xs'
            onChange={evt => onChangeValue?.(evt.target.value)}
          />
        </div>
      </td>
    </tr>
  );
}


export default PropertiesTable;
