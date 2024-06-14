import { Component } from '@angular/core';
import { CourseService } from '../../course.service';
import { CourseDto, DayDto, EventDto } from '../../dtos/course.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';


class WeekDto {
  id: number | undefined;
  days: DayDto[] | undefined;
  // lessons: LessonDto[];

}

@Component({
  selector: 'app-teacher-calendar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-calendar.component.html',
  styleUrl: './teacher-calendar.component.css'
})
export class TeacherCalendarComponent {
  course: CourseDto | undefined;
  weeks: WeekDto[] = [];
  months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  selectedMonth: number = new Date().getMonth();
  selectedDay: number | undefined;
  selDay : DayDto | undefined;

  selectedActivityId: number | undefined;
  selectedActivity: EventDto | undefined;

  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

  showActivityPopup: boolean = false;
  activityForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    date: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required)
  })

  editActivityForm2: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    date: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required)
  })

  editActivityForm = new FormGroup({
    event: new FormControl(0)

  })

  showEditActivityPopup: boolean = false;
  showEditActivityFormPopup: boolean = false;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {}

  async ngOnInit(): Promise<void> {
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
    lastDayofMonth.setMonth(this.selectedMonth+1)
    lastDayofMonth.setDate(0)
    console.log(firstDayofMonth, lastDayofMonth)

    const startDayOfFirstWeek = firstDayofMonth.getDay();
    console.log(startDayOfFirstWeek)
    let zeroCount = 0;

    for (let day = firstDayofMonth; day <= lastDayofMonth; day.setDate(day.getDate() + 1)) {
      console.log(day.getDate(), day)
      const week = Math.floor((day.getDate() + zeroCount -1 )/ 7);
      if (!this.weeks[week]) {
        console.log('creating week', week)
        this.weeks[week] = {
          id: week,
          days: []
        }
        while (week == 0 && this.weeks[week]?.days!.length < startDayOfFirstWeek -1) {
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
  onDayClick(day: DayDto) {
    if (day.id == 0) {
      return
    }

    console.log(`Clickeado dia ${day.id}`)
    console.log(day)
    this.selectedDay = day.id ? day.id : undefined;
    this.selDay = day;
  }

  onAddActivityClick() {
    if (!this.selectedDay) {
      alert("Seleccione un día primero")
      return
    } else {
      const currentYear = new Date().getFullYear();
      this.activityForm.controls['date'].setValue(formatDate(new Date(currentYear, this.selectedMonth, this.selectedDay), 'yyyy-MM-dd', 'en'))
      this.showActivityPopup = true;
    }
  }

  onAddActivitySubmit() {
    if (this.activityForm.invalid) {
      alert("Por favor llene todos los campos")
      return
    }
    console.log(this.activityForm.value)
    this.courseService.addCalendarEntry(this.course!.id!, this.activityForm.getRawValue()).subscribe((res) => {
      if (res.success) {
        alert("Actividad agregada exitosamente")
        this.showActivityPopup = false;
        this.activityForm.reset({description : ''});
          this.ngOnInit().then(() => {
            // update selected day
            for (let week of this.weeks) {
              for (let weekDay of week.days!) {
                if (weekDay.id == this.selectedDay) {
                  this.selDay = weekDay;
                }
              }
            }
          });

      } else {
        this.activityForm.reset({description : ''});
        alert(res.message)
        this.showActivityPopup = false;
      }

    });
  }

  onEditActivityClick() {
    if (!this.selectedDay) {
      alert("Seleccione un día primero")
      return
    }

    const date = new Date(new Date().getFullYear(), this.selectedMonth, this.selectedDay)
    console.log("Editando el dia", this.selectedDay)
    console.log("Eventos en el dia", this.selDay?.events?.length)
    if (this.selDay?.events?.length == 0) {
      alert("No hay actividades para editar")
      return
    }
    this.showEditActivityPopup = true;
  }

  onEditActivitySubmit() {
    console.log("EditActivitySubmit")
    this.selectedActivityId = this.editActivityForm.value.event!

    console.log(this.selDay)

    const activity = this.selDay!.events!.find((event) => event.id == this.selectedActivityId)
    console.log("Editando", activity)
    this.editActivityForm2.controls['date'].setValue(activity?.date)
    this.editActivityForm2.controls['name'].setValue(activity?.name)

    this.editActivityForm2.controls['description'].setValue(activity?.description)
    this.editActivityForm2.controls['id'].setValue(activity?.id)

    if (!this.editActivityForm.value.event) {
      alert("Seleccione una actividad primero")
      return
    }

    this.showEditActivityPopup = false;
    this.showEditActivityFormPopup = true
  }

  onEditActivityFormSubmit() {
    console.log("EditActivityFormSubmit");
    console.log(this.editActivityForm2.value)
    this.courseService.editActivity(this.course!.id!, this.editActivityForm2.value).subscribe((res) => {
      if (res.success) {
        alert("Actividad editada exitosamente")
        this.showEditActivityFormPopup = false;
        this.editActivityForm2.reset();
        this.ngOnInit().then(() => {
          // update selected day
          for (let week of this.weeks) {
            for (let weekDay of week.days!) {
              if (weekDay.id == this.selectedDay) {
                this.selDay = weekDay;
              }
            }
          }
        });
      } else {
        this.editActivityForm2.reset();
        alert(res.message)
        this.showEditActivityFormPopup = false;
      }
    });
  }
}
