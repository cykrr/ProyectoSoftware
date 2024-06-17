import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CourseDto, DayDto, EventDto } from '../../dtos/course.dto';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../course.service';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';


class WeekDto {
  id: number | undefined;
  days: DayDto[] | undefined;
  // lessons: LessonDto[];

}

@Component({
  selector: 'app-student-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './student-calendar.component.html',
  styleUrl: './student-calendar.component.css'
})
export class StudentCalendarComponent {
  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  course: CourseDto | undefined;
  weeks: WeekDto[] = [];
  months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  selectedMonth: number = new Date().getMonth();
  selectedDay: number | undefined;
  selDay : DayDto | undefined;
 faAngleLeft= faAngleLeft;
  faAngleRight= faAngleRight;


  onDayClick(ev: any) {

  }

  async ngOnInit() {
    console.log("reinit")
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.course = (await lastValueFrom(this.courseService.getCourse(courseId))).data;

    if (this.selectedDay)
      // find day in weeks
      for (let week of this.weeks) {
        for (let weekDay of week.days!) {
          if (weekDay.id == this.selectedDay) {

            this.selDay = weekDay;
          }
        }
      }
    if (this.selDay == null) console.log("uh oh")

    this.weeks = [];
    const firstDayofMonth = new Date()
    firstDayofMonth.setMonth(this.selectedMonth)
    firstDayofMonth.setDate(1)


    const lastDayofMonth = new Date()
    lastDayofMonth.setMonth(this.selectedMonth + 1)
    lastDayofMonth.setDate(0)
    console.log(firstDayofMonth, lastDayofMonth)

    const startDayOfFirstWeek = firstDayofMonth.getDay();
    console.log(startDayOfFirstWeek)
    let zeroCount = 0;

    for (let day = firstDayofMonth; day <= lastDayofMonth; day.setDate(day.getDate() + 1)) {
      console.log(day.getDate(), day)
      const week = Math.floor((day.getDate() + zeroCount - 1) / 7);
      if (!this.weeks[week]) {
        console.log('creating week', week)
        this.weeks[week] = {
          id: week,
          days: []
        }
        while (week == 0 && this.weeks[week]?.days!.length < startDayOfFirstWeek - 1) {
          // console.log("adding empty day")
          this.weeks[week].days?.push({
            id: 0,
            date: new Date()
          })
          zeroCount++;
        }
      }
      let events: EventDto[] = []
      for (let entry of this.course?.calendarEntries!) {
        const entryDate = new Date(entry.date!)
        entryDate.setDate(entryDate.getDate() + 1)
        console.log(entryDate.toLocaleDateString(), day.toLocaleDateString())
        if (entryDate.toLocaleDateString() == day.toLocaleDateString()) {
          events.push(entry)
        }
      }

      this.weeks[week].days?.push({
        id: day.getDate(),
        date: new Date(day),
        events,
      })
    }




  }



}
