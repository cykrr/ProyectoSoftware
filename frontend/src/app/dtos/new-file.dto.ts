import { UnidadDto } from "./unidad.dto";

export class NewFileDto {
  name: string | undefined;
  filename: string | undefined;
  mimetype: string | undefined;
}


export class DocumentDto {
  id: number | undefined;
  fileid: number | undefined;
  name: string | undefined;
  unidad: UnidadDto | undefined;
}
