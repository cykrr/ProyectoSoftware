import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGradeDto } from './create_grade.dto';
import { Grade } from './grade.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/course.entity';
import { Student } from 'src/users/user.entity';
import { CreateTopicDto } from 'src/topic/create-topic.dto';
import { Topic } from 'src/topic/topic.entity';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    private topicService: TopicService,
  ) {}

  async findAll(): Promise<Grade[]> {
    return this.gradeRepository.find({ relations: ['topics'] });
  }

  async find(id: number): Promise<Grade> {
    return this.gradeRepository.findOne({
      where: { id },
      relations: ['topics'],
    });
  }

  async setTopicCourse(grade: Grade, course: Course, topic: Topic) {
    if (!grade.topics) {
      grade.topics = [];
    }
    grade.topics.push(topic);
    this.gradeRepository.save(grade);
  }

  async addTopic(grade: Grade, topic: CreateTopicDto) {
    return this.topicService.create(topic).then((createdTopic) => {
      if (!grade.topics) {
        grade.topics = [];
      }
      grade.topics.push(createdTopic);
      return this.gradeRepository.save(grade);
    });
  }
  async create(grade: CreateGradeDto): Promise<Grade> {
    if (
      await this.gradeRepository.findOneBy({
        grade: grade.grade,
        gradePoint: grade.gradePoint,
      })
    ) {
      console.log('Grade already exists');
      return null;
    }
    return this.gradeRepository.save(grade);
  }

  async findGrade(grade: number, gradePoint: string): Promise<Grade | null> {
    return this.gradeRepository.findOne({
      where: { grade, gradePoint },
      relations: ['students', 'courses'],
    });
  }

  async addStudent(grade: Grade, student: Student) {
    if (!grade.students) {
      grade.students = [];
    }
    grade.students.push(student);
    this.gradeRepository.save(grade);
  }
}
