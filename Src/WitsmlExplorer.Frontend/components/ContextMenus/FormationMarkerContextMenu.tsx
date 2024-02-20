import { Divider, Typography } from "@equinor/eds-core-react";
import { MenuItem } from "@material-ui/core";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useConnectedServer } from "../../contexts/connectedServerContext";
import OperationContext from "../../contexts/operationContext";
import OperationType from "../../contexts/operationType";
import { useGetServers } from "../../hooks/query/useGetServers";
import { useOpenInQueryView } from "../../hooks/useOpenInQueryView";
import FormationMarker from "../../models/formationMarker";
import { ObjectType } from "../../models/objectType";
import { colors } from "../../styles/Colors";
import FormationMarkerPropertiesModal, {
  FormationMarkerPropertiesModalProps
} from "../Modals/FormationMarkerPropertiesModal";
import ContextMenu from "./ContextMenu";
import { StyledIcon } from "./ContextMenuUtils";
import { ObjectContextMenuProps, ObjectMenuItems } from "./ObjectMenuItems";

const FormationMarkerContextMenu = (
  props: ObjectContextMenuProps
): React.ReactElement => {
  const { checkedObjects, wellbore } = props;
  const { dispatchOperation } = useContext(OperationContext);
  const openInQueryView = useOpenInQueryView();
  const { connectedServer } = useConnectedServer();
  const queryClient = useQueryClient();
  const { servers } = useGetServers();

  const onClickModify = async () => {
    const modifyFormationMarkerProps: FormationMarkerPropertiesModalProps = {
      formationMarker: checkedObjects[0] as FormationMarker
    };
    dispatchOperation({
      type: OperationType.DisplayModal,
      payload: (
        <FormationMarkerPropertiesModal {...modifyFormationMarkerProps} />
      )
    });
    dispatchOperation({ type: OperationType.HideContextMenu });
  };

  const extraMenuItems = (): React.ReactElement[] => {
    return [
      <Divider key={"divider"} />,
      <MenuItem
        key={"properties"}
        onClick={onClickModify}
        disabled={checkedObjects.length !== 1}
      >
        <StyledIcon name="settings" color={colors.interactive.primaryResting} />
        <Typography color={"primary"}>Properties</Typography>
      </MenuItem>
    ];
  };

  return (
    <ContextMenu
      menuItems={[
        ...ObjectMenuItems(
          checkedObjects,
          ObjectType.FormationMarker,
          connectedServer,
          servers,
          dispatchOperation,
          queryClient,
          openInQueryView,
          wellbore,
          extraMenuItems()
        )
      ]}
    />
  );
};

export default FormationMarkerContextMenu;
