import { useEffect } from "react";
import {
  WITSML_INDEX_TYPE_DATE_TIME,
  WITSML_INDEX_TYPE_MD
} from "../components/Constants";
import { useSidebar } from "../contexts/sidebarContext";
import { SidebarActionType } from "../contexts/sidebarReducer";
import { ObjectType } from "../models/objectType";
import {
  calculateLogTypeId,
  calculateObjectGroupId,
  calculateWellNodeId,
  calculateWellboreNodeId
} from "../models/wellbore";

export function useExpandSidebarNodes(
  wellUid: string,
  wellboreUid?: string,
  objectType?: ObjectType,
  logType?: string
) {
  const { dispatchSidebar } = useSidebar();

  useEffect(() => {
    const nodeIds = [];
    if (wellUid) {
      nodeIds.push(calculateWellNodeId(wellUid));
    }

    if (wellUid && wellboreUid) {
      nodeIds.push(calculateWellboreNodeId({ wellUid, uid: wellboreUid }));
    }

    if (wellUid && wellboreUid && objectType) {
      nodeIds.push(
        calculateObjectGroupId({ wellUid, uid: wellboreUid }, objectType)
      );
    }

    if (wellUid && wellboreUid && logType) {
      nodeIds.push(
        calculateLogTypeId(
          { wellUid, uid: wellboreUid },
          logType === "depth"
            ? WITSML_INDEX_TYPE_MD
            : WITSML_INDEX_TYPE_DATE_TIME
        )
      );
    }

    dispatchSidebar({
      type: SidebarActionType.ExpandTreeNodes,
      payload: { nodeIds }
    });
  }, [wellUid, wellboreUid, objectType, logType]);
}

// TODO: Do we always want to expand all the nodes when this is used?
// What about when we navigate to a wellbore, then manually close the well, and then continue to the objects, and we have to close it again.
// Should we only expand the nodes on deep-linking and if the parent is opened?
