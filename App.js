import React from "react";
import "./App.css";

import Message from "./components/Message";
import MessageFrom from "./components/MessageFrom";
import UserInput from "./components/UserInput";
import Content from "./components/Content";
import Header from "./components/Header";
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from "constants";

class App extends React.Component {
  state = {
    UserName: "User",
    SendMessage: true,
    // BeginMessage after clear
    beginMessages: [
      {
        time: new Date(),
        from: "Fred",
        text: "Hey, it's me..",
        position: "true"
      }
    ],
    TodoList: [
      {
        text: "finish english worksheet",
        completed: false,
        priority: "middle"
      },
      {
        text: "learn for final exam",
        completed: false,
        priority: "high"
      },
      {
        text: "return books to library",
        completed: false,
        priority: "low"
      }
    ],
    messages: [
      {
        time: new Date(),
        from: "Fred",
        text: "Hi, I'm a chatbot",
        position: "true"
      }
      // {
      //   time: new Date(),
      //   from: "User",
      //   text:
      //     "If you are an infrequent traveler you may need some tips to keep the wife happy while you are jet setting around the globe.",
      //   position: "false"
      // }
    ]
  };

  componentDidMount() {
    this.TestForInactivity();
  }
  sliceout(text, Pos1, Pos2) {
    var words = text.split(" ");
    var Part1 = words.slice(0, Pos1);
    var Part2 = words.slice(Pos2);
    var TextReturn = [...Part1, ...Part2].join(" ");
    return TextReturn;
  }
  // change Username
  ChangeUserName = text => {
    var words = text.split(" ");
    var IndexOfIs = words.indexOf("is");
    var IndexOfName = words.indexOf("name");
    this.setState(state => {
      return {
        UserName: words.slice(IndexOfIs + 1, IndexOfIs + 2).join(" ")
      };
    });
    // var Part1 = words.slice(0, IndexOfName);
    // var Part2 = words.slice(IndexOfIs + 2);

    // var TextReturn = [...Part1, ...Part2].join(" ");
    return this.sliceout(text, IndexOfName, IndexOfIs + 2);
  };
  // add Reminder
  addReminder = text => {
    var words = text.split(" ");
    var number = text.match(/(remind||Remind)[a-zA-Z\s]+(\d+)/)[2];
    var IndexOfRemind = words.indexOf("remind");
    var IndexNumber = words.indexOf(String(number));
    var Time = words[IndexNumber + 1];
    var IndexofTime = words.indexOf(String(Time));
    var IndexOfTo = words.indexOf("to");
    var IndexOfIn = words.indexOf("in");

    if (IndexOfIn < IndexOfTo) {
      var todoText = words.slice(IndexOfTo + 1, words.length).join(" ");
    }
    if (IndexOfIn > IndexOfTo) {
      var todoText = words.slice(IndexOfTo + 1, IndexOfIn).join(" ");
    }

    if (Time === "seconds" || Time === "seconds") {
      var Miliseconds = number * 1000;
    }
    if (Time === "minutes" || Time === "minute") {
      var Miliseconds = number * 60 * 1000;
    }
    if (Time === "hours" || Time === "hour") {
      var Miliseconds = number * 60 * 60 * 1000;
    }
    if (IndexOfTo > 0) {
      setTimeout(() => {
        this.addBotMessage(`I should remind you to ${todoText}!`);
      }, Miliseconds);
    }
    if (IndexOfTo < 0) {
      setTimeout(() => {
        this.addBotMessage(`I should remind you!`);
      }, Miliseconds);
      return this.sliceout(text, IndexOfRemind, IndexofTime + 2);
    }
  };
  //change background if zero tasks
  noTasksLeft = text => {
    if (this.state.TodoList.length == 0) {
      return "backgroundDone";
    }
    if (this.noTasksLeftCheck() === 0) {
      return "backgroundDone";
    } else {
      return "background";
    }
  };
  noTasksLeftCheck = () => {
    var test = 0;
    for (var i = 0; i < this.state.TodoList.length; i++) {
      if (this.state.TodoList[i].completed === false) {
        test += 1;
      } else {
        test = test + 0;
      }
    }
    return test;
  };
  completeTask = text => {
    const words = text.split(" ");
    const itemIndex = text.match(/complete[a-zA-Z\s]+(\d+)/)[1] - 1;
    const IndexOfcomplete = words.indexOf("complete");
    const IndexofNumber = words.indexOf(String(itemIndex + 1));
    const newTodoList = this.state.TodoList.slice();
    newTodoList[itemIndex].completed = true;
    this.setState({
      TodoList: newTodoList
    });
    return [itemIndex, this.sliceout(text, IndexOfcomplete, IndexofNumber + 1)];
  };
  //Add a Taskt to TodoList
  addtoTodoList = text => {
    var words = text.split(" ");
    var IndexOfAdd = words.indexOf("add") + 1;
    var IndexOfTo = words.indexOf("to");

    var IndexOfList = words.indexOf("list");
    var IndexOfWithPriority = words.indexOf("with priority");
    if (words.indexOf("to") === -1) {
      if (words.indexOf("in") === -1) {
        var IndexOfTo = text.length;
      } else {
        var IndexOfTo = words.indexOf("in");
      }
    }
    if (words.indexOf("with priority") === -1) {
      var IndexOfWithPriority = text.length;
    }
    if (text.includes("priority")) {
      if (text.includes("high")) {
        var whichpriority = "high";
      }
      if (text.includes("middle")) {
        var whichpriority = "middle";
      }
      if (text.includes("low")) {
        var whichpriority = "low";
      }
    }
    if (IndexOfWithPriority < IndexOfTo) {
      var IndexCut = IndexOfWithPriority;
      var IndexEnd = IndexOfTo + 1;
    }
    if (IndexOfWithPriority > IndexOfTo) {
      var IndexCut = IndexOfTo;
      var IndexEnd = IndexOfWithPriority + 1;
    }
    this.setState(state => ({
      TodoList: [
        ...state.TodoList,
        {
          text: words.slice(IndexOfAdd, IndexCut).join(" "),
          completed: false,
          priority: whichpriority
        }
      ]
    }));

    return [
      this.sliceout(text, IndexOfAdd - 1, IndexOfList + 1),
      words.slice(IndexOfAdd, IndexCut).join(" ")
    ];
  };
  // Remove a Todo
  removeTodo = text => {
    const ItemIndex =
      text.match(/(remove|delete|Remove|Delete)[a-zA-Z\s]+(\d+)/)[2] - 1;
    const newTodoList = this.state.TodoList.slice();
    const tododelet = newTodoList[ItemIndex].text;
    newTodoList.splice(ItemIndex, 1);
    this.setState({
      TodoList: newTodoList
    });
    return tododelet;
  };
  // Add User Messages to chat
  addUserMessage = text => {
    this.TestForInactivity();
    this.setState(state => {
      return {
        messages: [
          ...state.messages,
          {
            time: new Date(),
            from: this.state.UserName,
            text: text,
            position: "false"
          }
        ]
      };
    });
  };
  // Add Bot Messages to chat
  addBotMessage = text => {
    setTimeout(() => {
      this.addBotMessageDelay(text);
    });
  };
  addBotMessageDelay = text => {
    this.state.SendMessage = true;
    this.setState(state => {
      var audio = new Audio("./stairs.mp3");

      audio.play();

      return {
        messages: [
          ...state.messages,
          {
            time: new Date(),
            from: "Fred",
            text: text,
            position: "true"
          }
        ]
      };
    });
  };
  TestForInactivity = value => {
    if (
      this.state.messages[this.state.messages.length - 1].text !=
      "Can I help you?"
    ) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.addBotMessage("Can I help you?");
      }, 1000 * 60 * 5);
    }

    // if (this.state.messages[this.state.messages.length-1].time === new Date()) {

    //   return true;
    // }
  };
  // Add written messages
  handleProcessMessage = value => {
    const newMessages = [
      ...this.state.messages,
      {
        from: "User",
        text: value
      }
    ];
    //Add the message of the User
    this.state.SendMessage = false;

    this.addUserMessage(value);
    // this.state.SendMessage = false;

    //split up the value into words.
    const SplitMessage = value.split(
      /(and |, |Also |In addition |; |However |Well |Furthermore |Nevertheless |if |If |or )/
    );

    SplitMessage.map(Message => {
      this.TestForMessage(Message);
    });
  };
  TestForMessage = value => {
    //Basic conservation
    const words = value.slice(" ");

    if (
      (value.includes("hi") && !value.includes("high")) ||
      value.includes("Hi") ||
      value.includes("hey") ||
      value.includes("Hey") ||
      value.includes("Hello") ||
      value.includes("Good morning") ||
      value.includes("Good afternoon") ||
      value.includes("Good night") ||
      value.includes("hello")
    ) {
      this.state.SendMessage = true;

      // this.addUserMessage(value);
      this.addBotMessage("Hi, nice to meet you!");
      // return;
    }

    if (
      (value.includes("name") ||
        value.includes("I'm") ||
        value.includes("i am") ||
        value.includes("I am") ||
        value.includes("i'm")) &&
      !value.includes("your")
    ) {
      this.state.SendMessage = true;
      //change Name
      value = this.ChangeUserName(value);
      // this.addUserMessage(value);
      this.addBotMessage("I changed your username");
      // return;
    }
    if (value.includes("What") && value.includes("your name")) {
      this.state.SendMessage = true;
      this.addBotMessage("I'm Fred");
    }
    if (
      value.includes("like") &&
      // value.includes("?") &&
      value.includes(" me")
    ) {
      this.state.SendMessage = true;

      this.addBotMessage(
        "Yea sure, you are a kind person because you are using a Todo-List Chatbot ;)"
      );
    }

    //clear chat history
    if (value === "clear") {
      this.state.SendMessage = true;

      this.setState({
        messages: this.state.beginMessages
      });
    }

    //Mark TODO as complete
    if (value.includes("complete")) {
      this.state.SendMessage = true;

      let itemIndex;
      [itemIndex, value] = this.completeTask(value);
      // this.addUserMessage(value);
      this.addBotMessage(`I marked Todo number ${itemIndex + 1} as completed.`);
      // return;
    }
    //reminder
    if (value.includes("remind") || value.includes("Remind")) {
      this.state.SendMessage = true;

      this.addReminder(value);
      this.addBotMessage("Oke, I will remind you soon.");

      // return;
    }

    // Add new task to Todo list
    if (value.includes("add")) {
      this.state.SendMessage = true;

      let text;
      [value, text] = this.addtoTodoList(value);
      // this.addUserMessage(value);
      this.addBotMessage(`I added "${text}" to your todo-list.`);
      // return;
    }
    //Delet a task from Todo List
    if (
      value.includes("remove") ||
      value.includes("delete") ||
      value.includes("Remove") ||
      value.includes("Delete")
    ) {
      this.state.SendMessage = true;

      const tododelet = this.removeTodo(value);
      // this.addUserMessage(value);
      this.addBotMessage(`I removed this todo: "${tododelet}"`);
      // return;
    }
    //
    //Show todolist
    if (
      (value.includes("show") &&
        (value.includes("list") ||
          value.includes("todos") ||
          value.includes("todo")) &&
        value.includes("dont") === false && value.includes("not") === false) ||
      ((value.includes("What") || value.includes("what")) &&
        (value.includes("list") ||
          value.includes("todos") ||
          value.includes("todo")))
    ) {
      this.state.SendMessage = true;

      // this.addUserMessage(value);

      this.addBotMessage(this.renderTodoList());
      // return;
    }
    if (value.includes("help")) {
      this.state.SendMessage = true;

      // this.addUserMessage(value);
      this.addBotMessage(
        "Do you need help? You can add, complete, delete, remove Todos. I can show your todo list and their priorities (low, middle, high). Futhermore I can remind you for anything. Have a good one 😉"
      );
      // return;
    }
    if (
      value.includes("oke") ||
      value.includes("ok") ||
      value.includes("Oke") ||
      value.includes("Ok") ||
      value.includes("cool") ||
      value.includes("Cool") ||
      value.includes("wow") ||
      value.includes("Wow") ||
      value.includes("no") ||
      value.includes("yes")
    ) {
      this.state.SendMessage = true;
    }
    if (
      value.includes("nice to meet you") ||
      value.includes("Nice to meet you")
    ) {
      this.state.SendMessage = true;
      this.addBotMessage("Thanks, nice to meet you too!");
    }
    if (value.includes("thanks")) {
      this.state.SendMessage = true;

      this.addBotMessage("Your welcome!");
    }
    if (value.includes("How are you?") || value.includes("how are you")) {
      this.state.SendMessage = true;
      this.addBotMessage("Fine, thanks");
    }
    if (this.state.SendMessage === false) {
      this.state.SendMessage = true;
      var number = Math.random();
      if (number < 0.5) {
        this.addBotMessage(
          "Sorry, I can't understand you. But here's a dancing banana."
        );
        this.addBotMessage(<img src="./Banana.gif" width="200px"></img>);
      } else {
        this.addBotMessage("Sorry, I can't understand you. I'm really sorry");
        this.addBotMessage(<img src="./Sorry.gif" width="200px"></img>);
      }
    }

    // this.addUserMessage(value);
  };
  /////////////////////////////////////////////////////////////

  renderTodoList = () => {
    const todoItems = this.state.TodoList.map(obj => {
      if (obj.completed === true) {
        return (
          <li className={obj.priority}>
            <strike>{obj.text}</strike>
          </li>
        );
      } else {
        return <li className={obj.priority}>{obj.text}</li>;
      }
    });
    return <ol className="TodoListRender">{todoItems}</ol>;
  };

  newTodo = value => {
    var words = value.split(" ");
    var IndexOfAdd = words.indexOf("add") + 1;
    var IndexOfTo = words.indexOf("to");
    if (words.indexOf("to") === -1) {
      var IndexOfTo = words.length;
    }

    return words.slice(IndexOfAdd, IndexOfTo).join(" ");
  };

  render() {
    /////////////////////////////////////////////////////////////////////////////////////////////
    if (this.TestForInactivity()) {
      this.addBotMessage("hi");
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    const Chats = this.state.messages.map(chat => (
      <Message from={chat.from} time={chat.time} right={chat.position}>
        {chat.text}
      </Message>
    ));

    return (
      <>
        <div className={"App " + this.noTasksLeft()}>
          <Header />
          <Content>{Chats}</Content>
          <div className="BottomBanner">
            <UserInput
              onSubmit={this.handleProcessMessage}
              className="UserInput"
            ></UserInput>
          </div>
        </div>
      </>
    );
  }
}

export default App;
