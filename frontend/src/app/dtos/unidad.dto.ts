import { FileDto } from "./file.dto";

export class UnidadDto {
  id: number | undefined;
  name: string | undefined;
  files: FileDto[] | undefined;
}
