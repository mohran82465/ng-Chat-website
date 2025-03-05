import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';
import { DeleteModalComponent } from "../../layout/delete-modal/delete-modal.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  
  
  private auth = inject (AuthService); 
  private chatService = inject (ChatService); 
  private router = inject(Router); 
  private fb  = inject(FormBuilder);  
  chatForm!: FormGroup;
  chats = signal<Ichat[]>([])

  constructor(){
    this.chatForm = this.fb.group({
      chat_message: ['',Validators.required] 
    })

    effect(()=>{
      this.onListChat();
    })
  }
  async logOut()
  {
    this.auth.signOut().then(()=>{
      this.router.navigate(['/login'])
    }).catch((err)=>{
      alert(err.message) ;
    })
  }


  onSubmit(){ 
    const formValue = this.chatForm.value.chat_message 
    console.log(formValue);
    this.chatService.chatMessage(formValue).then((res)=> {
      console.log(res);
      this.chatForm.reset(); 
      this.onListChat()
    })
    .catch((err)=>{
      alert(err.message);
    });
  }

  onListChat(){
    this.chatService.listChat().then((res:Ichat[] | null )=>{
      console.log(res);
      if(res !== null ){

        this.chats.set(res)
      }
      else{
        console.log("No messages Fonund");
        
      }
    }).catch((err)=>{alert(err.message)})
  }





  openDropDown(msg:Ichat){
    console.log(msg);
    this.chatService.selctedChats(msg); 
    
    
  }




}
