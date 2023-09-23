import {
  Clickable,
  EvaluatedTrue,
  GenericLabel,
  PromptDisplay,
} from "@quenti/components/test";
import type { TrueFalseData } from "@quenti/interfaces";

import { Box, Grid, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleX,
  IconCircleXFilled,
} from "@tabler/icons-react";

import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { useCardSelector } from "../use-card-selector";
import type { CardProps } from "./common";

export const TrueFalseCard: React.FC<CardProps> = ({ i, result }) => {
  const { question, data, answer, remarks } = useCardSelector<TrueFalseData>(i);

  const rightSide = data.distractor
    ? word(question.answerMode, data.distractor, "answer")
    : word(question.answerMode, data.term, "answer");

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);

  const trueSelected = answer === true;
  const falseSelected = answer === false;

  const evaluation = result
    ? (!data.distractor && trueSelected) || (!!data.distractor && falseSelected)
    : undefined;

  const remark = result ? remarks?.[0] : undefined;

  return (
    <>
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr 2px 1fr" }}
        gap={{ base: 1, md: 3 }}
      >
        <Box w="full" pr={{ base: 0, sm: "4" }}>
          <PromptDisplay
            label={question.answerMode == "Definition" ? "Term" : "Definition"}
            content={word(question.answerMode, data.term, "prompt")}
          />
        </Box>
        <Box
          display={{ base: "none", sm: "grid" }}
          bg="gray.200"
          _dark={{
            bg: "gray.700",
          }}
        />
        <Box
          w="full"
          h="2px"
          my="4"
          display={{ base: "block", sm: "none" }}
          bg="gray.200"
          _dark={{
            bg: "gray.700",
          }}
        />
        <Box w="full" pl={{ base: 0, sm: 4 }}>
          <PromptDisplay
            label={question.answerMode == "Definition" ? "Definition" : "Term"}
            content={rightSide}
          />
        </Box>
      </Grid>
      <Stack>
        <GenericLabel evaluation={evaluation}>
          {remark?.remark ?? "Choose an answer"}
        </GenericLabel>
        <SimpleGrid columns={2} gap={{ base: 4, md: 6 }}>
          <Clickable
            hasIcon
            disabled={result}
            isSelected={trueSelected}
            evaluation={trueSelected ? evaluation : undefined}
            onClick={() => {
              if (!trueSelected) answerQuestion<TrueFalseData>(i, true);
              else clearAnswer(i);
            }}
          >
            <HStack>
              {trueSelected ? (
                <IconCircleCheckFilled size={18} />
              ) : (
                <IconCircleCheck size={18} />
              )}
              <Text>True</Text>
            </HStack>
          </Clickable>
          <Clickable
            hasIcon
            disabled={result}
            isSelected={falseSelected}
            evaluation={falseSelected ? evaluation : undefined}
            onClick={() => {
              if (!falseSelected) answerQuestion<TrueFalseData>(i, false);
              else clearAnswer(i);
            }}
          >
            <HStack>
              {falseSelected ? (
                <IconCircleXFilled size={18} />
              ) : (
                <IconCircleX size={18} />
              )}
              <Text>False</Text>
            </HStack>
          </Clickable>
        </SimpleGrid>
      </Stack>
      {result && !!data.distractor && (
        <Stack>
          <GenericLabel>
            Correct{" "}
            {question.answerMode == "Definition" ? "definition" : "term"}
          </GenericLabel>
          <EvaluatedTrue>
            {word(question.answerMode, data.term, "answer")}
          </EvaluatedTrue>
        </Stack>
      )}
    </>
  );
};
