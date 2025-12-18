import { useApproveLetterApplication } from "@/hooks/use-letter-applications";
import { TLetterApplicationWithRelation } from "@/schemas/letter-application-schema";
import { TUser } from "@/schemas/user-schema";

import { Button } from "../ui/button";

interface Props {
  letterApplication: TLetterApplicationWithRelation;
  approvedBy: TUser;
}

export default function ApproveLetterApplicationForm({
  letterApplication,
  approvedBy,
}: Props) {
  const { isPending, mutateAsync } = useApproveLetterApplication();

  async function onSubmit() {
    await mutateAsync({
      id: letterApplication.id as number,
      payload: { approved_by: approvedBy.id, status: "approved" },
    });
  }

  return (
    <div className="">
      <pre>{JSON.stringify(letterApplication, null, 2)}</pre>
      <Button>Approve</Button>
    </div>
  );
}
