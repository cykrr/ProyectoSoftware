import { Controller, Get } from '@nestjs/common';
import { GradeService } from './grade.service';

@Controller('grades')
export class GradeController {
  constructor(private gradeService: GradeService) {}
  @Get()
  async getGrades() {
    return this.gradeService.findAll();
  }
}
