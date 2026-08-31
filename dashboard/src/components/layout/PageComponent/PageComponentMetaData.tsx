import { appName } from "@/helper/constants";
import type { TPageComponentMetaDataProps } from "./PageComponent.model";

export const PageComponentMetaData = (props: TPageComponentMetaDataProps) => {
  return (
    <>
      <title>
        {props.title ? `${appName} - ${props.title}` : appName}
      </title>
      {props.description ? (
        <meta name="description" content={props.description} />
      ) : null}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};
