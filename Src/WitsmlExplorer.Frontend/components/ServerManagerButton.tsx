import { Button } from "@equinor/eds-core-react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthorizationState } from "../contexts/authorizationStateContext";
import OperationContext from "../contexts/operationContext";
import { AuthorizationStatus } from "../services/authorizationService";
import { Colors } from "../styles/Colors";
import Icon from "../styles/Icons";

export interface ServerManagerButtonProps {
  showLabels: boolean;
}

const ServerManagerButton = (
  props: ServerManagerButtonProps
): React.ReactElement => {
  const { authorizationState } = useAuthorizationState();
  const {
    operationState: { colors }
  } = useContext(OperationContext);
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/");
  };

  const connected =
    authorizationState?.status === AuthorizationStatus.Authorized;
  return (
    <StyledButton
      colors={colors}
      variant={props.showLabels ? "ghost" : "ghost_icon"}
      onClick={onClick}
    >
      <Icon name={connected ? "cloudDownload" : "cloudOff"} />
      {props.showLabels && (connected ? "Server Connections" : "No Connection")}
    </StyledButton>
  );
};

const StyledButton = styled(Button)<{ colors: Colors }>`
  white-space: nowrap;
  color: ${(props) => props.colors.infographic.primaryMossGreen};
`;

export default ServerManagerButton;
