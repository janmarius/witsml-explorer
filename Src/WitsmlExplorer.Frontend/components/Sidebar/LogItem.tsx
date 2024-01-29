import { MouseEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OperationContext from "../../contexts/operationContext";
import OperationType from "../../contexts/operationType";
import LogObject from "../../models/logObject";
import Well from "../../models/well";
import Wellbore from "../../models/wellbore";
import {
  getContextMenuPosition,
  preventContextMenuPropagation
} from "../ContextMenus/ContextMenu";
import LogObjectContextMenu from "../ContextMenus/LogObjectContextMenu";
import { ObjectContextMenuProps } from "../ContextMenus/ObjectMenuItems";
import TreeItem from "./TreeItem";

interface LogItemProps {
  log: LogObject;
  well: Well;
  wellbore: Wellbore;
  logGroup: string;
  logTypeGroup: string;
  selected: boolean;
  nodeId: string;
  objectGrowing: boolean;
  to: string;
}

export default function LogItem({
  log: log,
  wellbore,
  selected,
  nodeId,
  objectGrowing,
  to
}: LogItemProps) {
  const { dispatchOperation } = useContext(OperationContext);
  const navigate = useNavigate();

  const onContextMenu = (event: MouseEvent<HTMLLIElement>, log: LogObject) => {
    preventContextMenuPropagation(event);
    const contextProps: ObjectContextMenuProps = {
      checkedObjects: [log],
      wellbore
    };
    const position = getContextMenuPosition(event);
    dispatchOperation({
      type: OperationType.DisplayContextMenu,
      payload: {
        component: <LogObjectContextMenu {...contextProps} />,
        position
      }
    });
  };

  return (
    <TreeItem
      onContextMenu={(event) => onContextMenu(event, log)}
      key={nodeId}
      nodeId={nodeId}
      labelText={log.runNumber ? `${log.name} (${log.runNumber})` : log.name}
      selected={selected}
      isActive={objectGrowing}
      onLabelClick={() => {
        navigate(to);
      }}
    />
  );
}
