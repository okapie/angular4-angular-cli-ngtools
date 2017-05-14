import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TodoStore, Todo} from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public todoStore: TodoStore;

  public form: FormGroup;

  public newTodoText: AbstractControl | string;

  public model = {
    errorTextEntry: '',
    errorWordCount: ''
  };

  constructor(public fb: FormBuilder,
              todoStore: TodoStore
  ) {

    this.form = fb.group({

      'newTodoText': ['', Validators.compose([Validators.required, Validators.maxLength(20)])]
    });

    this.newTodoText = this.form.controls['newTodoText'];

    this.todoStore = todoStore;
  }

  stopEditing(todo: Todo, editedTitle: string) {
    if(editedTitle.length !== 0){
      todo.title = editedTitle.trim();
    }
    todo.editing = false;
  }

  updateEditingTodo(todo: Todo, editedTitle: string) {
    editedTitle = editedTitle.trim();
    todo.editing = false;

    if (editedTitle.length === 0) {
      return this.todoStore.remove(todo);
    }

    todo.title = editedTitle;
  }

  editTodo(todo: Todo) {
    todo.editing = true;
  }

  removeCompleted() {
    this.todoStore.removeCompleted();
  }

  toggleCompletion(todo: Todo) {
    this.todoStore.toggleCompletion(todo);
  }

  remove(todo: Todo){
    this.todoStore.remove(todo);
  }

  addTodo() {

    this.model.errorTextEntry = '';
    this.model.errorWordCount = '';

    if (!this.form.valid) {

      if (!this.form.dirty || this.form.value.newTodoText === '') {

        this.model.errorTextEntry = 'Please fill out the form before pressing the Enter key.';
      } else if (this.form.value.newTodoText.length > 20) {

        this.model.errorWordCount = 'Please enter text less than 20 words.';
      }
    } else {

      if (this.form.valid) {

        this.todoStore.add(this.form.value.newTodoText);
        this.newTodoText = '';
      }
    }
  }
}
