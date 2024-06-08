import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Topic, Unidad } from './topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTopicDto } from './create-topic.dto';
import {
  CreateDocumentDto,
  DocumentService,
} from 'src/document/document.service';
import { FilesService } from 'src/files/files.service';
import { Course } from 'src/courses/course.entity';
import { MDocument } from 'src/document/mdocument.entity';
import { UnidadAlreadyExistsError } from 'src/errors/unidad-already-exists.error';

class CreateUnidadDto {
  // id: number | undefined;
  name: string | undefined;
  documents?: CreateDocumentDto[] | undefined;
}

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    @InjectRepository(Unidad)
    private unidadRepository: Repository<Unidad>,
    private documentService: DocumentService,
    private filesService: FilesService,
  ) {}

  async findDocument(id: string): Promise<MDocument> {
    const document = await this.documentService.find(id);
    return document;
  }

  async cargarDocumento(
    id: number,
    unidadId: number,
    file: Express.Multer.File,
    friendlyName: string,
    nombreUnidad: string,
  ) {
    console.log(`[TopicService] Cargando documento a Tema ${id} en la unidad ${unidadId} - ${file.originalname}`);
    // Buscar Tema
    const topic = await this.find(id);
    if (!topic) return { success: false, message: 'Topic not found' };

    let unidad = null;

    if (unidadId < 0) {
        unidad = await this.createUnidad(id, { name: nombreUnidad });
        topic.unidades.push(unidad);
    } else {
      // Buscar Unidad
      unidad = await this.obtenerUnidad(id, unidadId);
      if (!unidad) return { success: false, message: 'Unidad no encontrada' };
    }

    // Create File
    const cfile = await this.filesService.create(
      file.originalname,
      file.mimetype,
      file.buffer,
    );

    console.log(`[TopicService] File created: ${cfile._id.toString()}`)
    console.log(`[TopicService] Creando documento:`)

    // Create Document
    let doc = await this.documentService.create({
      fileid: cfile._id.toString(),
      name: friendlyName,
      // unidad,
    });

    // doc = await this.documentService.save(doc);
    // console.log(`[TopicService] Guardando documento:`, doc)

    if (!doc)
      return { success: false, message: 'No se pudo crear el documento' };

    console.log(`[TopicService] Document created: ${doc}`)

    doc.unidad = topic.unidades.at(-1);
    if (!topic.unidades.at(-1).documents) topic.unidades.at(-1).documents = [];
    topic.unidades.at(-1).documents.push(doc);
    if (topic.course) {
      if (!topic.course.documents) topic.course.documents = [];
      topic.course.documents.push(doc)
    }

    console.log(topic.unidades.at(-1).documents)
    
    const updTopic = await this.topicRepository.save(topic);
    return {
      success: true,
      data: {
        fileid: doc.fileid,
        name: doc.name,
        unidad: { id: unidad.id, name: unidad.name },
      },
    };
  }

  async find(id: number): Promise<Topic> {
    return this.topicRepository.findOne({
      where: { id },
      relations: ['unidades.documents', 'course.documents'],
    });
  }
  async create(topic: CreateTopicDto): Promise<Topic> {
    const createdTopic = this.topicRepository.create(topic);
    return this.topicRepository.save(createdTopic);
  }

  async update(topic: Topic): Promise<Topic> {
    return this.topicRepository.save(topic);
  }

  async obtenerUnidad(topicId: number, unidadId: number): Promise<Unidad> {
    const topic = await this.find(topicId);
    if (!topic) return null;
    const unidad = topic.unidades.find((u) => u.id === unidadId);
    return unidad;
  }

  async createUnidad(topicId: number, unidad: CreateUnidadDto) {
    console.log(
      `[TopicService] Creando unidad "${unidad.name}" en tema ${topicId}`,
    );

    const topic = await this.find(topicId);
    if (!topic) throw new Error("Topic not found");
    if (!topic.unidades) topic.unidades = [];
    // if (!topic.course) throw new Error("Topic has no course");
    // if (!topic.course.documents) topic.course.documents = [];

    if (topic.unidades.find((u) => u.name === unidad.name)) {
      console.log(`[TopicService] Unidad ${unidad.name} ya existe`)
      throw new UnidadAlreadyExistsError(unidad.name);
    }

    if (!topic) throw new NotFoundException();
    // Crear la unidad
    const unidadParcial = {
      name: unidad.name,
      documents: [],
    };
    const cu = await this.unidadRepository.create(unidadParcial);
    return cu
  }
}
