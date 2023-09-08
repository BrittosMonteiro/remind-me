import CollectionCard from "@/components/CollectionCard";
import CreateCollectionButton from "@/components/CreateCollectionButton";
import SadFace from "@/components/icons/SadFace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { wait } from "@/lib/wait";
import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <WelcomeMessageComponent />
      </Suspense>
      <Suspense fallback={<div>Loading collections</div>}>
        <ColletionList />
      </Suspense>
    </>
  );
}

async function WelcomeMessageComponent() {
  const user = await currentUser();
  await wait(3000);

  if (!user) {
    return <div>Error!</div>;
  }

  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Welcome, <br />
        {`${user.firstName} ${user.lastName}`}
      </h1>
    </div>
  );
}

function WelcomeMessageFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[150px] h-[36px]" />
        <Skeleton className="w-[150px] h-[36px]" />
      </h1>
    </div>
  );
}

async function ColletionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  if (collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Alert>
          <SadFace />
          <AlertTitle>There are no collections yet</AlertTitle>
          <AlertDescription>
            Create a collection to get started
          </AlertDescription>
        </Alert>
        <CreateCollectionButton />
      </div>
    );
  } else {
    return (
      <>
        <CreateCollectionButton />
        <div className="gap-4 mt-4 flex flex-col">
          {collections.map((collection, key) => (
            <CollectionCard key={key} collection={collection} />
          ))}
        </div>
      </>
    );
  }
}
