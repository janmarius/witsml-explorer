import { TextField, Typography } from "@equinor/eds-core-react";
import OperationType from "../../contexts/operationType";
import { Server } from "../../models/server";
import { DispatchOperation } from "../ContextMenus/ContextMenuUtils";
import ConfirmModal from "./ConfirmModal";
import { ModalContentLayout } from "./ModalDialog";

export function displayMissingWellboreModal(targetServer: Server, wellUid: string, wellboreUid: string, dispatchOperation: DispatchOperation, message = "") {
  const confirmation = (
    <ConfirmModal
      heading={`Wellbore not found`}
      content={
        <ModalContentLayout>
          <Typography>Unable to find wellbore</Typography>
          <TextField readOnly id="targetServer" label="Target Server Name" defaultValue={targetServer.name} />
          <TextField readOnly id="wellUid" label="Well UID" defaultValue={wellUid} />
          <TextField readOnly id="wellboreUid" label="Wellbore UID" defaultValue={wellboreUid} />
          <Typography>{message}</Typography>
        </ModalContentLayout>
      }
      onConfirm={() => dispatchOperation({ type: OperationType.HideModal })}
      confirmColor={"primary"}
      confirmText={`OK`}
      showCancelButton={false}
    />
  );
  dispatchOperation({ type: OperationType.DisplayModal, payload: confirmation });
}

export function displayMissingLogModal(targetServer: Server, wellUid: string, wellboreUid: string, logUid: string, dispatchOperation: DispatchOperation, message = "") {
  const confirmation = (
    <ConfirmModal
      heading={`Log not found`}
      content={
        <ModalContentLayout>
          <Typography>Unable to find log</Typography>
          <TextField readOnly id="targetServer" label="Target Server Name" defaultValue={targetServer.name} />
          <TextField readOnly id="wellUid" label="Well UID" defaultValue={wellUid} />
          <TextField readOnly id="wellboreUid" label="Wellbore UID" defaultValue={wellboreUid} />
          <TextField readOnly id="logUid" label="Log UID" defaultValue={logUid} />
          <Typography>{message}</Typography>
        </ModalContentLayout>
      }
      onConfirm={() => dispatchOperation({ type: OperationType.HideModal })}
      confirmColor={"primary"}
      confirmText={`OK`}
      showCancelButton={false}
    />
  );
  dispatchOperation({ type: OperationType.DisplayModal, payload: confirmation });
}
