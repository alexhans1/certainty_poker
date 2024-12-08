import ConformDialogButton from "../../../shared/ConfirmDialogButton";

export type StartGame = () => Promise<void>;

interface Props {
  startGame: StartGame;
  isDisabled: boolean;
}

function StartGameButton({ startGame, isDisabled }: Props) {
  const onConfirm = async () => {
    await startGame();
  };
  return (
    <ConformDialogButton
      onConfirm={onConfirm}
      dialogTitle="Are you sure you want to start the game? Once it's started no more players can join."
      confirmLabel="Start Game"
      buttonLabel="Start Game"
      isDisabled={isDisabled}
    />
  );
}

export default StartGameButton;
