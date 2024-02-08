import { Fragment, MouseEvent, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthorizationState } from "../../contexts/authorizationStateContext";
import NavigationContext from "../../contexts/navigationContext";
import OperationContext from "../../contexts/operationContext";
import OperationType from "../../contexts/operationType";
import { useGetWellbore } from "../../hooks/query/useGetWellbore";
import LogObject from "../../models/logObject";
import { calculateObjectNodeId } from "../../models/objectOnWellbore";
import { ObjectType } from "../../models/objectType";
import Wellbore, {
  calculateLogTypeDepthId,
  calculateLogTypeId,
  calculateLogTypeTimeId,
  calculateObjectGroupId,
  calculateObjectNodeId as calculateWellboreObjectNodeId
} from "../../models/wellbore";
import {
  WITSML_INDEX_TYPE_DATE_TIME,
  WITSML_INDEX_TYPE_MD
} from "../Constants";
import {
  getContextMenuPosition,
  preventContextMenuPropagation
} from "../ContextMenus/ContextMenu";
import LogsContextMenu, {
  LogsContextMenuProps
} from "../ContextMenus/LogsContextMenu";
import { IndexCurve } from "../Modals/LogPropertiesModal";
import LogItem from "./LogItem";
import TreeItem from "./TreeItem";

interface LogTypeItemProps {
  logs: LogObject[];
  wellUid: string;
  wellboreUid: string;
}

export default function LogTypeItem({
  logs,
  wellUid,
  wellboreUid
}: LogTypeItemProps) {
  const { navigationState } = useContext(NavigationContext);
  const { dispatchOperation } = useContext(OperationContext);
  const { servers } = navigationState;
  const { authorizationState } = useAuthorizationState();
  const { wellbore } = useGetWellbore(
    authorizationState?.server,
    wellUid,
    wellboreUid
  );
  const logGroup = calculateObjectGroupId(wellbore, ObjectType.Log);
  const logTypeGroupDepth = calculateLogTypeDepthId(wellbore);
  const logTypeGroupTime = calculateLogTypeTimeId(wellbore);
  const navigate = useNavigate();
  const {
    wellUid: urlWellUid,
    wellboreUid: urlWellboreUid,
    logType,
    objectUid
  } = useParams();

  const onSelectType = (logTypeGroup: string) => {
    navigate(
      `servers/${encodeURIComponent(
        authorizationState.server.url
      )}/wells/${wellUid}/wellbores/${wellboreUid}/objectgroups/${
        ObjectType.Log
      }/logtypes/${
        logTypeGroup === logTypeGroupDepth ? "depth" : "time"
      }/objects`
    );
  };

  const onContextMenu = (
    event: MouseEvent<HTMLLIElement>,
    wellbore: Wellbore,
    indexCurve: IndexCurve
  ) => {
    preventContextMenuPropagation(event);
    const contextMenuProps: LogsContextMenuProps = {
      dispatchOperation,
      wellbore,
      servers,
      indexCurve
    };
    const position = getContextMenuPosition(event);
    dispatchOperation({
      type: OperationType.DisplayContextMenu,
      payload: {
        component: <LogsContextMenu {...contextMenuProps} />,
        position
      }
    });
  };
  const depthLogs = filterLogsByType(logs, WITSML_INDEX_TYPE_MD);
  const timeLogs = filterLogsByType(logs, WITSML_INDEX_TYPE_DATE_TIME);

  const isSelected = (log: LogObject) => {
    return (
      calculateWellboreObjectNodeId(
        { wellUid: log.wellUid, uid: log.wellboreUid },
        log.indexType,
        log.uid
      ) ===
      calculateWellboreObjectNodeId(
        { wellUid: urlWellUid, uid: urlWellboreUid },
        logType === "depth"
          ? WITSML_INDEX_TYPE_MD
          : WITSML_INDEX_TYPE_DATE_TIME,
        objectUid
      )
    );
  };

  return (
    <>
      <TreeItem
        labelText={"Depth"}
        nodeId={logTypeGroupDepth}
        onLabelClick={() => onSelectType(logTypeGroupDepth)}
        onContextMenu={(event) =>
          onContextMenu(event, wellbore, IndexCurve.Depth)
        }
        isActive={depthLogs?.some((log) => log.objectGrowing)}
        selected={
          calculateLogTypeId(
            { wellUid: urlWellUid, uid: urlWellboreUid },
            logType
          ) === calculateLogTypeId(wellbore, "depth")
        }
      >
        {listLogItemsByType(
          depthLogs,
          WITSML_INDEX_TYPE_MD,
          wellUid,
          wellboreUid,
          logGroup,
          isSelected,
          authorizationState.server.url
        )}
      </TreeItem>
      <TreeItem
        nodeId={logTypeGroupTime}
        labelText={"Time"}
        onLabelClick={() => onSelectType(logTypeGroupTime)}
        onContextMenu={(event) =>
          onContextMenu(event, wellbore, IndexCurve.Time)
        }
        isActive={timeLogs?.some((log) => log.objectGrowing)}
        selected={
          calculateLogTypeId(
            { wellUid: urlWellUid, uid: urlWellboreUid },
            logType
          ) === calculateLogTypeId(wellbore, "time")
        }
      >
        {listLogItemsByType(
          timeLogs,
          WITSML_INDEX_TYPE_DATE_TIME,
          wellUid,
          wellboreUid,
          logGroup,
          isSelected,
          authorizationState.server.url
        )}
      </TreeItem>
    </>
  );
}

const filterLogsByType = (logs: LogObject[], logType: string) => {
  return logs?.filter((log) => log.indexType === logType) ?? [];
};

const listLogItemsByType = (
  logObjects: LogObject[],
  logType: string,
  wellUid: string,
  wellboreUid: string,
  logGroup: string,
  isSelected: (log: LogObject) => boolean,
  serverUrl: string
) => {
  return logObjects?.map((log) => (
    <Fragment key={calculateObjectNodeId(log, ObjectType.Log)}>
      <LogItem
        log={log}
        wellUid={wellUid}
        wellboreUid={wellboreUid}
        logGroup={logGroup}
        logTypeGroup={calculateLogTypeId(
          { wellUid, uid: wellboreUid },
          logType
        )}
        nodeId={calculateObjectNodeId(log, ObjectType.Log)}
        selected={isSelected(log)}
        objectGrowing={log.objectGrowing}
        to={`servers/${encodeURIComponent(
          serverUrl
        )}/wells/${wellUid}/wellbores/${wellboreUid}/objectgroups/${
          ObjectType.Log
        }/logtypes/${
          logType === WITSML_INDEX_TYPE_DATE_TIME ? "time" : "depth"
        }/objects/${log.uid}`}
      />
    </Fragment>
  ));
};
