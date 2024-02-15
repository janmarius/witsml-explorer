import React, { useContext, useState } from "react";
import OperationContext from "../../../contexts/operationContext";
import OperationType from "../../../contexts/operationType";
import { createTrimLogObjectJob } from "../../../models/jobs/trimLogObjectJob";
import LogObject, { indexToNumber } from "../../../models/logObject";
import JobService, { JobType } from "../../../services/jobService";
import {
  WITSML_INDEX_TYPE_DATE_TIME,
  WITSML_INDEX_TYPE_MD,
  WITSML_LOG_ORDERTYPE_DECREASING
} from "../../Constants";
import WarningBar from "../../WarningBar";
import ModalDialog from "../ModalDialog";
import AdjustDateTimeModal from "./AdjustDateTimeModal";
import AdjustNumberRangeModal from "./AdjustNumberRangeModal";

export interface TrimLogObjectModalProps {
  logObject: LogObject;
}

const TrimLogObjectModal = (
  props: TrimLogObjectModalProps
): React.ReactElement => {
  const { logObject } = props;
  const { dispatchOperation } = useContext(OperationContext);
  const [log] = useState<LogObject>(logObject);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<string | number>();
  const [endIndex, setEndIndex] = useState<string | number>();
  const [confirmDisabled, setConfirmDisabled] = useState<boolean>();

  const onSubmit = async () => {
    setIsLoading(true);
    const trimLogObjectJob = createTrimLogObjectJob(log, startIndex, endIndex);
    JobService.orderJob(JobType.TrimLogObject, trimLogObjectJob);
    dispatchOperation({ type: OperationType.HideModal });
    // TODO: Check that the job returns a RefreshAction. Previously, this modal manually updated the object, but now it should be done through the job.
  };

  const toggleConfirmDisabled = (isValid: boolean) => {
    setConfirmDisabled(!isValid);
  };

  return (
    <>
      {log && (
        <ModalDialog
          heading={`Adjust start/end index for ${log.name}`}
          content={
            <>
              {log.indexType === WITSML_INDEX_TYPE_DATE_TIME && (
                <AdjustDateTimeModal
                  minDate={log.startIndex}
                  maxDate={log.endIndex}
                  isDescending={
                    log.direction == WITSML_LOG_ORDERTYPE_DECREASING
                  }
                  onStartDateChanged={setStartIndex}
                  onEndDateChanged={setEndIndex}
                  onValidChange={toggleConfirmDisabled}
                />
              )}
              {log.indexType === WITSML_INDEX_TYPE_MD && (
                <AdjustNumberRangeModal
                  minValue={indexToNumber(logObject.startIndex)}
                  maxValue={indexToNumber(logObject.endIndex)}
                  isDescending={
                    log.direction == WITSML_LOG_ORDERTYPE_DECREASING
                  }
                  onStartValueChanged={setStartIndex}
                  onEndValueChanged={setEndIndex}
                  onValidChange={toggleConfirmDisabled}
                />
              )}
              <WarningBar message="Adjusting start/end index will permanently remove data values outside selected range" />
            </>
          }
          onSubmit={onSubmit}
          isLoading={isLoading}
          confirmColor={"danger"}
          confirmText={"Adjust"}
          confirmDisabled={confirmDisabled}
          switchButtonPlaces
        />
      )}
    </>
  );
};

export default TrimLogObjectModal;
