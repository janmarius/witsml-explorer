import { Button, Dialog, Progress, Typography } from "@equinor/eds-core-react";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import OperationContext from "../../contexts/operationContext";
import OperationType from "../../contexts/operationType";
import { colors } from "../../styles/Colors";
import Icons from "../../styles/Icons";

interface ModalDialogProps {
  heading: string;
  content: ReactElement;
  onSubmit: () => void;
  isLoading: boolean;
  confirmColor?: "default" | "inherit" | "primary" | "secondary" | "danger";
  confirmText?: string;
  confirmDisabled?: boolean;
  switchButtonPlaces?: boolean;
  errorMessage?: string;
  width?: ModalWidth;
  onCancel?: () => void;
  onDelete?: () => void;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  ButtonPosition?: controlButtonPosition;
}

const ModalDialog = (props: ModalDialogProps): React.ReactElement => {
  const {
    heading,
    content,
    onDelete,
    onSubmit,
    isLoading,
    confirmColor,
    confirmText,
    confirmDisabled,
    errorMessage,
    switchButtonPlaces,
    width = ModalWidth.MEDIUM,
    showConfirmButton = true,
    showCancelButton = true,
    ButtonPosition = controlButtonPosition.BOTTOM
  } = props;
  const context = React.useContext(OperationContext);
  const [confirmButtonIsFocused, setConfirmButtonIsFocused] = useState<boolean>(false);
  const confirmButtonIsDisabled = isLoading || confirmDisabled;

  const onCancel =
    props.onCancel ??
    (() => {
      context.dispatchOperation({ type: OperationType.HideModal });
    });

  const onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !confirmButtonIsDisabled) {
      if (!switchButtonPlaces || confirmButtonIsFocused) onSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const buttons = [
    showConfirmButton ? (
      isLoading ? (
        <StyledButton style={{ cursor: "not-allowed" }}>
          <Progress.Dots />
        </StyledButton>
      ) : (
        <StyledButton
          key={"confirm"}
          onFocus={() => setConfirmButtonIsFocused(true)}
          onBlur={() => setConfirmButtonIsFocused(false)}
          disabled={confirmButtonIsDisabled}
          onClick={onSubmit}
          color={confirmColor ?? "primary"}
          variant="contained"
        >
          {ButtonPosition == controlButtonPosition.TOP ? <Icons name="save" /> : ""}
          {confirmText ?? "Save"}
        </StyledButton>
      )
    ) : (
      <></>
    ),
    showCancelButton ? (
      <StyledButton key={"cancel"} disabled={isLoading} onClick={onCancel} color={confirmColor ?? "primary"} variant="outlined">
        Cancel
      </StyledButton>
    ) : (
      <></>
    ),
    <StyledButton
      key={"delete"}
      disabled={isLoading}
      onClick={onDelete}
      color={"danger"}
      variant="contained"
      align={"right"}
      style={{ marginLeft: "auto", margin: "0.5em", float: "right" }}
    >
      Delete
    </StyledButton>
  ];

  const top = (
    <HeadTitle>
      <Typography
        color="primary"
        token={{
          fontSize: "1.5rem",
          fontWeight: 600
        }}
      >
        {heading}
      </Typography>
      <Typography style={{ display: "flex" }}>
        {buttons[switchButtonPlaces ? 1 : 0]}
        {buttons[switchButtonPlaces ? 0 : 1]}
        {ButtonPosition ? <></> : onDelete && buttons[2]}
      </Typography>
    </HeadTitle>
  );
  const bottom = (
    <Dialog.Actions>
      {buttons[switchButtonPlaces ? 1 : 0]}
      {buttons[switchButtonPlaces ? 0 : 1]}
      {onDelete && buttons[2]}
    </Dialog.Actions>
  );
  const header = (
    <Dialog.Header>
      <Dialog.Title>{heading}</Dialog.Title>
    </Dialog.Header>
  );
  return (
    <Dialog onKeyDown={onKeyPress} open={true} style={{ width: width }}>
      {ButtonPosition == controlButtonPosition.TOP ? top : header}
      <Content>
        {content}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Content>
      {ButtonPosition == controlButtonPosition.BOTTOM ? bottom : <></>}
    </Dialog>
  );
};

export enum ModalWidth {
  SMALL = "444px", // xs
  MEDIUM = "600px", // sm
  LARGE = "960px" // md
}

const HeadTitle = styled.div`
  margin-top: 0.5rem;
  display: flex;
  padding: 0.5rem 2rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid ${colors.interactive.disabledBorder};
`;

export const ModalContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export enum controlButtonPosition {
  TOP = "top",
  BOTTOM = "bottom"
}

const Content = styled(Dialog.CustomContent)`
  margin-top: 0.5em;
  max-height: 75vh;
  overflow-y: auto;

  --track-color: #dddddd;
  --thumb-color: #bbbbbb;
  scrollbar-color: var(--track-color) var(--thumb-color);

  //For firefox
  scrollbar-width: thin;
  padding-bottom: 8px;

  // For Google Chrome/Safari/Edge
  & ::-webkit-scrollbar {
    height: 8px;
  }

  & ::-webkit-scrollbar-thumb {
    background: var(--thumb-color);
    border-radius: 8px;
  }

  & ::-webkit-scrollbar-track {
    background: var(--track-color);
  }
`;

const StyledButton = styled(Button)<{ align?: string }>`
  &&& {
    ${({ align }) => (align === "right" ? `margin-left: auto;` : "margin: 0.5em;")};
  }
`;

const ErrorMessage = styled.div`
  margin-top: 0.5em;
  color: red;
  line-break: auto;
`;

export default ModalDialog;
