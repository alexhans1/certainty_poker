import { GrMoney } from "react-icons/gr";
import { QuestionRound } from "../../../../interfaces";

interface Props {
  usedQuestionRound: QuestionRound;
  isGameFull: boolean;
}

export default function Pot({ usedQuestionRound, isGameFull }: Props) {
  const totalPot = usedQuestionRound?.bettingRounds.reduce((sum, br) => {
    br.bets.forEach((bet) => {
      sum += bet.amount;
    });
    return sum;
  }, 0);

  const positioning = isGameFull
    ? "md:-right-5 md:-top-10"
    : "md:left-24 md:bottom-20";

  return (
    <div
      className={`text-2xl md:text-3xl self-start z-1003 md:absolute ${positioning}`}
    >
      <div className="flex -mb-3">
        <span className="mx-1">
          <GrMoney />
        </span>
        <span>{totalPot}</span>
      </div>
      <span className="text-xs md:text-sm">In Pot</span>
    </div>
  );
}
