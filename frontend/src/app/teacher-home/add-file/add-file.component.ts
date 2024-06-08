import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../../files.service';
import { UnidadDto } from '../../dtos/unidad.dto';
import { TopicDto } from '../../dtos/grade.dto';
import { CommonModule } from '@angular/common';
import { TopicService } from '../../topic.service';
import { lastValueFrom } from 'rxjs';
import { DocumentDto } from '../../dtos/new-file.dto';

@Component({
  selector: 'add-file',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-file.component.html',
  styleUrl: './add-file.component.css'
})
export class AddFileComponent {
  private file: File | undefined;
  @Output() onFileUploadSuccess: EventEmitter<DocumentDto> = new EventEmitter();
  @Input() show: boolean | undefined;
  @Input() topic: TopicDto | undefined;
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  showUnidadInput: boolean = false;

  addFileForm: FormGroup = new FormGroup({
    name: new FormControl('', ),
    selectUnidad: new FormControl('', {validators: [Validators.required]}),
    inputUnidad: new FormControl(''),
    file : new FormControl(null, {validators: [Validators.required]})
  })

  onUnidadChange(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    const newValue = target.value;
    this.showUnidadInput = newValue === 'new';
  }

  constructor(
    private fileService: FilesService,
    private formBuilder: FormBuilder,
    private topicService: TopicService) {}


  hide() {
    this.show = false;
    this.addFileForm.reset()
    this.showChange.emit(false);
  }

  async onAddFileFormSubmit(ev: Event) {

    if (!this.addFileForm.valid) {
      console.log(this.addFileForm.controls['name'].errors)
      console.log(this.addFileForm.controls['inputUnidad'].errors)
      console.log(this.addFileForm.controls['selectUnidad'].errors)
      console.log(this.addFileForm.controls['file'].errors)
      alert('Invalid form');
      this.hide()
      return
    }

    if (!this.topic) {
      alert('No topic selected');
      this.hide()
      return
    }
    if (!this.file) {
      alert('No file selected');
      this.hide()
      return
    }

    console.log("trying to upload file")
    const formData = new FormData();
    console.log(this.file)
    formData.append('file', this.file!);
    const name = this.addFileForm.value.name;
    console.log(name, this.addFileForm.value.selectUnidad)
    console.log(this.file!.name)
    const unidad = this.addFileForm.value.selectUnidad;
    formData.append('name', name != null && name != '' ? name! : this.file!.name);
    console.log(formData)
    formData.append('idTopic', this.topic!.id!.toString());
    // si se seleccionó una unidad
    if (unidad !== 'new') {
      formData.append('idUnidad', unidad);
    } else {
        formData.append('idUnidad', '-1');
        formData.append('nombreUnidad', this.addFileForm.value.inputUnidad);
    }

    this.topicService.cargarArchivo(formData).subscribe((res) => {
      console.log(res)
      if (res.success) {
        this.hide()
        this.onFileUploadSuccess.emit(res.data)
      } else {
        alert(res.message)
        this.hide()
      }

    });

  }

  onFileChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const file = target.files?.item(0);
    console.log(this.topic?.unidades)
    if (file) {
      this.file = file;
      console.log(file)
    }
  }
}
