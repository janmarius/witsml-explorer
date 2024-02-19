import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useConnectedServer } from "../../contexts/connectedServerContext";
import OperationContext from "../../contexts/operationContext";
import { useGetObjects } from "../../hooks/query/useGetObjects";
import { useExpandSidebarNodes } from "../../hooks/useExpandObjectGroupNodes";
import { ObjectType } from "../../models/objectType";
import formatDateString from "../DateFormatter";
import { ContentTable, ContentTableColumn, ContentType } from "./table";

export default function ChangeLogsListView() {
  const {
    operationState: { timeZone, dateTimeFormat }
  } = useContext(OperationContext);
  const { wellUid, wellboreUid } = useParams();
  const { connectedServer } = useConnectedServer();

  const { objects: changeLogs } = useGetObjects(
    connectedServer,
    wellUid,
    wellboreUid,
    ObjectType.ChangeLog
  );

  useExpandSidebarNodes(wellUid, wellboreUid, ObjectType.ChangeLog);

  const getTableData = () => {
    return changeLogs.map((changeLog) => {
      return {
        id: changeLog.uid,
        uidObject: changeLog.uidObject,
        nameObject: changeLog.nameObject,
        lastChangeType: changeLog.lastChangeType,
        dTimCreation: formatDateString(
          changeLog.commonData.dTimCreation,
          timeZone,
          dateTimeFormat
        ),
        dTimLastChange: formatDateString(
          changeLog.commonData.dTimLastChange,
          timeZone,
          dateTimeFormat
        )
      };
    });
  };

  const columns: ContentTableColumn[] = [
    { property: "uidObject", label: "uidObject", type: ContentType.String },
    { property: "nameObject", label: "nameObject", type: ContentType.String },
    {
      property: "lastChangeType",
      label: "lastChangeType",
      type: ContentType.DateTime
    },
    {
      property: "dTimCreation",
      label: "commonData.dTimCreation",
      type: ContentType.DateTime
    },
    {
      property: "dTimLastChange",
      label: "commonData.dTimLastChange",
      type: ContentType.DateTime
    }
  ];

  return (
    changeLogs && (
      <ContentTable
        viewId="changeLogsListView"
        columns={columns}
        data={getTableData()}
        showRefresh
        downloadToCsvFileName="ChangeLogs"
      />
    )
  );
}
