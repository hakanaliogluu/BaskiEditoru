// editor.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  editorForm: FormGroup;
  items: any[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.editorForm = this.fb.group({
      paperType: ['A5'],
      customWidth: [''],
      customHeight: [''],
      inputType: ['text'],
      fieldName: [''],
      fontType: ['Arial'],
      fontSize: ['14'],
      bold: [false],
      italic: [false],
      underline: [false],
      strikethrough: [false],
      x: [0],
      y: [0]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addItem() {
    const formValue = this.editorForm.value;
    let newItem: any;

    if (formValue.inputType === 'text') {
      newItem = {
        type: 'text',
        value: formValue.fieldName,
        x: formValue.x,
        y: formValue.y,
        font: formValue.fontType,
        font_size: formValue.fontSize,
        bold: formValue.bold,
        italic: formValue.italic,
        underline: formValue.underline,
        strikethrough: formValue.strikethrough
      };
    } else if (formValue.inputType === 'image' && this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        newItem = {
          type: 'image',
          value: reader.result,
          x: formValue.x,
          y: formValue.y
        };
        this.items.push(newItem);
      };
      reader.readAsDataURL(this.selectedFile);
    }

    this.items.push(newItem);
  }

  saveChanges() {
    const payload = {
      items: this.items
    };

    this.http.post('https://pusulaweb.com.tr/api/editor', payload)
      .subscribe(response => {
        console.log('Response:', response);
      });
  }

  onDrop(event: any) {
    const droppedItem = event.source.data;
    const index = this.items.findIndex(item => item === droppedItem);
    this.items[index].x = event.distance.x;
    this.items[index].y = event.distance.y;
  }
}
