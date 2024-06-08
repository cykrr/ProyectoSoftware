import { DocumentDto } from "./new-file.dto";

export class UnidadDto {
  id?: number | undefined;
  name: string | undefined;
  documents?: DocumentDto[] | undefined;
}
