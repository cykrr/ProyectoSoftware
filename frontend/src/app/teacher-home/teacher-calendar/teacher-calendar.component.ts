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
  showActivityPickerPopup: boolean = false;
  showEditActivityPopup: boolean = false;

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

  activityPickerForm = new FormGroup({
    event: new FormControl(0)

  })

  selectActivityMotive: string = "NONE"

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
    console.log(firstDayofMonth.toUTCString(), lastDayofMonth.toUTCString())

    const startDayOfFirstWeek = firstDayofMonth.getDay();
    console.log(startDayOfFirstWeek)
    let zeroCount = 0;

    for (let day = firstDayofMonth; day <= lastDayofMonth; day.setDate(day.getDate() + 1)) {

      // Semana del dia actual
      const week = Math.floor((day.getDate() + zeroCount -1 )/ 7);

      // Inicialización de la semana
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
            date: undefined
          })
          zeroCount++;
        }
      }


      let events: EventDto[] = []
      for (let entry of this.course?.calendarEntries!) {
        const entryDate = new Date(entry.date!)
        entryDate.setDate(entryDate.getDate())
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
    this.selectActivityMotive = "editar"
    this.showActivityPickerPopup = true;
  }

  editActivity() {
    console.log("EditActivity");
    console.log("Editando", this.selectedActivity)
    this.editActivityForm2.controls['date'].setValue(formatDate(this.selectedActivity?.date!, 'yyyy-MM-dd', 'en'))
    this.editActivityForm2.controls['name'].setValue(this.selectedActivity?.name)

    this.editActivityForm2.controls['description'].setValue(this.selectedActivity?.description)
    this.editActivityForm2.controls['id'].setValue(this.selectedActivity?.id)

    this.showActivityPickerPopup = false;
    this.showEditActivityPopup = true;


  }

  delActivity() {
    console.log("DelActivity");
    this.courseService.delActivity(this.course!.id!, this.selectedActivityId!).subscribe((res) => {
      if (res.success) {
        alert("Actividad eliminada exitosamente")
        this.showActivityPickerPopup = false;
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
        alert(res.message)
        this.showActivityPickerPopup = false;
      }
    });
  }

  onActivityPickerFormSubmit() {
    console.log("ActivityPickerSubmit")

    if (!this.activityPickerForm.value.event) {
      alert("Seleccione una actividad primero")
      return
    }

    this.selectedActivityId = this.activityPickerForm.value.event!
    this.selectedActivity = this.selDay?.events?.find((event) => event.id == this.selectedActivityId)

    if (this.selectActivityMotive == "editar") {
      this.editActivity()
    } else {
      this.delActivity()
    }
  }

  onEditActivityFormSubmit() {
    if (this.editActivityForm2.invalid) {
      alert("Por favor llene todos los campos")
      return
    }

    console.log("EditActivityFormSubmit");
    console.log(this.editActivityForm2.value)
    this.courseService.editActivity(this.course!.id!, this.editActivityForm2.value).subscribe((res) => {
      if (res.success) {
        alert("Actividad editada exitosamente")
        this.showEditActivityPopup = false;
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
        this.showEditActivityPopup = false;
      }
    });
  }
  onDelActivityClick() {
    if (!this.selectedDay) {
      alert("Seleccione un día primero")
      return
    }


    const date = new Date(new Date().getFullYear(), this.selectedMonth, this.selectedDay)
    console.log("Eliminando en el dia", this.selectedDay)
    console.log("Eventos en el dia", this.selDay?.events?.length)
    if (this.selDay?.events?.length == 0) {
      alert("No hay actividades para editar")
      return
    }

    this.selectActivityMotive = "eliminar"
    this.showActivityPickerPopup = true;
  }
}
