import React, { useContext } from "react";
import NavigationContext from "../../contexts/navigationContext";
import NavigationType from "../../contexts/navigationType";
import OperationContext from "../../contexts/operationContext";
import OperationType from "../../contexts/operationType";
import Well from "../../models/well";
import { getContextMenuPosition } from "../ContextMenus/ContextMenu";
import WellContextMenu, { WellContextMenuProps } from "../ContextMenus/WellContextMenu";
import formatDateString from "../DateFormatter";
import WellProgress from "../WellProgress";
import { ContentTable, ContentTableColumn, ContentTableRow, ContentType } from "./table";

export interface WellRow extends ContentTableRow, Well {}

export const WellsListView = (): React.ReactElement => {
  const { navigationState, dispatchNavigation } = useContext(NavigationContext);
  const { servers, filteredWells, wells } = navigationState;
  const {
    dispatchOperation,
    operationState: { timeZone }
  } = useContext(OperationContext);

  const columns: ContentTableColumn[] = [
    { property: "name", label: "Name", type: ContentType.String },
    { property: "field", label: "Field", type: ContentType.String },
    { property: "operator", label: "Operator", type: ContentType.String },
    { property: "timeZone", label: "Time zone", type: ContentType.String },
    { property: "uid", label: "UID Well", type: ContentType.String },
    { property: "dateTimeCreation", label: "Creation date", type: ContentType.DateTime },
    { property: "dateTimeLastChange", label: "Last changed", type: ContentType.DateTime }
  ];

  const onSelect = (well: any) => {
    dispatchNavigation({ type: NavigationType.SelectWell, payload: { well, wellbores: well.wellbores } });
  };

  const onContextMenu = (event: React.MouseEvent<HTMLLIElement>, well: Well, checkedWellRows: WellRow[]) => {
    const contextProps: WellContextMenuProps = { well, servers, dispatchOperation, checkedWellRows };
    const position = getContextMenuPosition(event);
    dispatchOperation({ type: OperationType.DisplayContextMenu, payload: { component: <WellContextMenu {...contextProps} />, position } });
  };

  const getTableData = () => {
    return filteredWells.map((well) => {
      return {
        ...well,
        id: well.uid,
        dateTimeCreation: formatDateString(well.dateTimeCreation, timeZone),
        dateTimeLastChange: formatDateString(well.dateTimeLastChange, timeZone)
      };
    });
  };

  return (
    <WellProgress>
      {wells.length > 0 && filteredWells.length == 0 ? (
        <>No wells match the current filter</>
      ) : (
        <ContentTable columns={columns} data={getTableData()} onSelect={onSelect} onContextMenu={onContextMenu} checkableRows />
      )}
    </WellProgress>
  );
};

export default WellsListView;
