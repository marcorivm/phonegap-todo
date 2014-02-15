/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var TODO = function($form, $todo, $done, storage_name) {
    var tasks = [];
    var template =  '<td>' +
                        '<input type="checkbox" class="check-todo" id="todo_{{ID}}" {{STATUS}}>' +
                    '</td>' +
                    '<td><label for="todo_{{ID}}">{{NAME}}</label></td>' +
                    '<td>' +
                        '<div class="btn-group">' +
                            '<button type="button" class="btn btn-info edit-todo"><span class="glyphicon glyphicon-edit"></span></button>' +
                            '<button type="button" class="btn btn-danger delete-todo"><span class="glyphicon glyphicon-trash"></span></button>' +
                        '</div>' +
                    '</td>';
    var TASK =  function(attributes) {
        // Define TASK obj
        var $el = $('<tr>');
        var obj = {
            attributes: {
                'id' : attributes.id,
                'name': attributes.name,
                'status': ((attributes.done)? 'checked="checked"' : 'uncheked')
            },
            render: function() {
                var skeleton = template;
                skeleton = skeleton.replace(/{{ID}}/g, this.attributes.id);
                skeleton = skeleton.replace(/{{NAME}}/g, this.attributes.name);
                skeleton = skeleton.replace(/{{STATUS}}/g, this.attributes.status);
                this.getElement().html(skeleton);
                return this;
            },
            update: function() {
                this.render();
                this.onUpdate(this);
                this.bindEvents();
                return this;
            },
            bindEvents: function() {
                var obj = this;
                obj.getElement().on('click', '.delete-todo', function() {
                    obj.getElement().remove();
                    obj.onDelete(obj);
                });
                obj.getElement().on('click', '.edit-todo', function() {
                    obj.attributes.name = prompt("Nuevo nombre");
                    obj.update();
                });
                obj.getElement().on('click', '.check-todo', function() {
                    obj.attributes.status = (this.checked)? 'checked="checked"' : 'uncheked';
                    obj.update();
                });
            },
            isDone: function() {
                return (this.attributes.status !== "uncheked");
            },
            onDelete: attributes.onDelete,
            onUpdate: attributes.onUpdate,
            getElement: function() {
                return $el;
            }
        };
        return obj.update();
    };

    // Define TODO obj
    var obj = {
        tasks: tasks,
        addTask: function(name, done) {
            var new_task = TASK({
                'name': name,
                'done': done,
                'id': tasks.length,
                'onDelete': this.removeTask,
                'onUpdate': this.updateTaskStatus
            });
            tasks.push(new_task);
            if(done) {
                $done.append(new_task.getElement());
            } else {
                $todo.append(new_task.getElement());
            }
            obj.saveToStorage();
        },
        removeTask: function(task) {
            tasks[task.attributes.id] = undefined;
            obj.saveToStorage();
        },
        updateTaskStatus: function(task) {
            if(task.isDone() && $todo.find(task.getElement())) {
                task.getElement().remove();
                $done.append(task.getElement());
            } else if(!task.isDone() && $done.find(task.getElement())) {
                task.getElement().remove();
                $todo.append(task.getElement());
            };
            obj.saveToStorage();
        },
        saveToStorage: function() {
            var json_tasks = JSON.stringify(tasks);
            window.localStorage.setItem(storage_name, json_tasks)
        },
        loadFromStorage: function() {
            // Obtener string en json
            var json_tasks = window.localStorage.getItem(storage_name);
            // Parsear string con json
            var new_tasks = JSON.parse(json_tasks);
            // Agregar cada tarea a la aplicación
            for (var i = 0; i < new_tasks.length; i++) {
                var done = new_tasks[i].attributes.status === 'checked="checked"';
                this.addTask(new_tasks[i].attributes.name, done);
            };
        }
    };

    obj.loadFromStorage();

    $form.on('submit', function () {
        var $input = $form.find('input[name="todo-name"]');
        if($input.val().length > 0) {
            obj.addTask($input.val());
            $input.val('');
        } else {
            alert('Ingresa una tarea!');
        }
        return false;
    });

    return obj;
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
