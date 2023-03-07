import { TextField } from "@equinor/eds-core-react";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import OperationContext from "../../contexts/operationContext";
import OperationType from "../../contexts/operationType";
import MaxLength from "../../models/maxLength";
import MudLog from "../../models/mudLog";
import ObjectOnWellbore, { toObjectReference } from "../../models/objectOnWellbore";
import JobService, { JobType } from "../../services/jobService";
import formatDateString from "../DateFormatter";
import ModalDialog from "./ModalDialog";

export interface MudLogPropertiesModalProps {
  mudLog: MudLog;
}

interface EditableMudLog extends ObjectOnWellbore {
  mudLogCompany?: string;
  mudLogEngineers?: string;
}

const MudLogPropertiesModal = (props: MudLogPropertiesModalProps): React.ReactElement => {
  const { mudLog } = props;
  const {
    operationState: { timeZone },
    dispatchOperation
  } = useContext(OperationContext);
  const [editableMudLog, setEditableMudLog] = useState<EditableMudLog>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (updatedMudLog: EditableMudLog) => {
    setIsLoading(true);
    const modifyMudLogJob = {
      mudLog: updatedMudLog
    };
    await JobService.orderJob(JobType.ModifyMudLog, modifyMudLogJob);
    setIsLoading(false);
    dispatchOperation({ type: OperationType.HideModal });
  };

  useEffect(() => {
    if (mudLog != null) {
      setEditableMudLog(toObjectReference(mudLog));
    }
  }, [mudLog]);

  const invalidName = invalid(mudLog?.name, editableMudLog?.name, MaxLength.Name);
  const invalidMudLogCompany = invalid(mudLog?.mudLogCompany, editableMudLog?.mudLogCompany, MaxLength.Name);
  const invalidMudLogEngineers = invalid(mudLog?.mudLogEngineers, editableMudLog?.mudLogEngineers, MaxLength.Description);
  return (
    <>
      {editableMudLog && (
        <ModalDialog
          heading={`Edit properties for ${editableMudLog.uid}`}
          content={
            <Layout>
              <EditableTextField
                property="name"
                invalid={invalidName}
                maxLength={MaxLength.Name}
                setter={setEditableMudLog}
                originalObject={mudLog}
                editableObject={editableMudLog}
              />
              <EditableTextField
                property="mudLogCompany"
                invalid={invalidMudLogCompany}
                maxLength={MaxLength.Name}
                setter={setEditableMudLog}
                originalObject={mudLog}
                editableObject={editableMudLog}
              />
              <EditableTextField
                property="mudLogEngineers"
                invalid={invalidMudLogEngineers}
                maxLength={MaxLength.Description}
                setter={setEditableMudLog}
                originalObject={mudLog}
                editableObject={editableMudLog}
              />
              <TextField disabled id="nameWell" label="nameWell" defaultValue={mudLog?.wellName} />
              <TextField disabled id="nameWellbore" label="nameWellbore" defaultValue={mudLog?.wellboreName} />
              <TextField disabled id="objectGrowing" label="objectGrowing" defaultValue={`${mudLog?.objectGrowing}`} />
              <TextField id="startMd" label="startMd" disabled defaultValue={mudLog?.startMd?.value} unit={mudLog?.startMd?.uom} />
              <TextField id="endMd" label="endMd" disabled defaultValue={mudLog?.endMd?.value} unit={mudLog?.endMd?.uom} />
              <TextField disabled id="dTimCreation" label="commonData.dTimCreation" defaultValue={formatDateString(mudLog?.commonData?.dTimCreation, timeZone)} />
              <TextField disabled id="dTimLastChange" label="commonData.dTimLastChange" defaultValue={formatDateString(mudLog?.commonData?.dTimCreation, timeZone)} />
            </Layout>
          }
          confirmDisabled={invalidName || invalidMudLogCompany || invalidMudLogEngineers}
          onSubmit={() => onSubmit(editableMudLog)}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

type Key = keyof EditableMudLog & keyof MudLog;
export interface EditableTextFieldProps {
  property: Key;
  invalid: boolean;
  maxLength: number;
  setter: React.Dispatch<React.SetStateAction<EditableMudLog>>;
  originalObject: MudLog;
  editableObject: EditableMudLog;
}

const EditableTextField = (props: EditableTextFieldProps): React.ReactElement => {
  const { property, invalid, maxLength, setter, originalObject, editableObject } = props;
  const originalValue = originalObject[property];
  const value = editableObject[property];
  return (
    <TextField
      id={property}
      label={property}
      defaultValue={value != null ? value : originalValue ?? ""}
      variant={invalid ? "error" : undefined}
      helperText={invalid ? `${property} must be 1-${maxLength} characters` : ""}
      onChange={(e: any) => setter({ ...editableObject, [property]: nullOnUnchagedEmpty(originalValue, e.target.value) })}
    />
  );
};

const nullOnUnchagedEmpty = (original?: string, edited?: string): string | null => {
  if (edited?.length > 0) {
    return edited;
  }
  if (original == null || original.length == 0) {
    return null;
  }
  return "";
};

const invalid = (original: string, edited: string, maxLength: MaxLength): boolean => {
  return errorOnDeletion(original, edited) || (edited != null && edited.length > maxLength);
};

const errorOnDeletion = (original: string, edited: string): boolean => {
  if (original == null || original.length == 0) {
    return false;
  }
  return edited != null && edited.length == 0;
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(1, auto);
  gap: 1rem;
`;

export default MudLogPropertiesModal;