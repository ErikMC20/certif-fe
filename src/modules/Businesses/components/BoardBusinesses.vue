<script lang="ts" setup>
import { ref, computed } from 'vue';
import HeaderBoard from './HeaderBoard.vue';
import Draggable from 'vuedraggable';

const list1 = ref([
  { name: 'John', id: 1 },
  { name: 'Joao', id: 2 },
  { name: 'Jean', id: 3 },
  { name: 'Gerard', id: 4 },
]);

const list2 = ref([
  { name: 'Juan', id: 5 },
  { name: 'Edgard', id: 6 },
  { name: 'Johnson', id: 7 },
]);

const drag = ref(false);

const size = ref({ width: '200px', height: '200px' });

let planned_task = [
  {
    title: 'Buy milk',
    label: '15 mins',
    tags: [
      { name: 'Error', color: 'negative' },
      { name: 'Warning', color: 'warning' },
    ],
    description: '2 Gallons of milk at the Deli store',
  },
  {
    title: 'Dispose Garbage',
    label: '10 mins',
    tags: [
      { name: 'Info', color: 'info' },
      { name: 'Success', color: 'positive' },
    ],
    description: 'Sort out recyclable and waste as needed',
  },
  {
    title: 'Write Blog',
    label: '10 mins',
    tags: [{ name: 'Warning', color: 'warning' }],
    description: 'Can AI make memes?',
  },
  {
    title: 'Pay Rent',
    label: '5 mins',
    tags: [
      { name: 'Error', color: 'negative' },
      { name: 'Warning', color: 'warning' },
      {
        name: 'Info',
        color: 'info',
      },
    ],
    description: 'Transfer to bank account',
  },
];
let wip_task = [
  {
    title: 'Clean House',
    label: '30 mins',
    tags: [
      { name: 'Error', color: 'negative' },
      { name: 'Success', color: 'positive' },
    ],
    description:
      'Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses',
  },
  {
    title: 'Go Trekking',
    label: '30 mins',
    tags: [
      { name: 'Info', color: 'info' },
      { name: 'Success', color: 'positive' },
      {
        name: 'Info',
        color: 'info',
      },
      { name: 'Success', color: 'positive' },
      { name: 'Info', color: 'info' },
      {
        name: 'Success',
        color: 'positive',
      },
    ],
    description: 'Completed 10km on cycle',
  },
];
let blocked_task = [
  {
    title: 'Morning Jog',
    label: '30 mins',
    tags: [{ name: 'Error', color: 'negative' }],
    description: 'Track using fitbit',
  },
];
let completed_task = [
  {
    title: 'Practice Meditation',
    label: '15 mins',
    tags: [],
    description: 'Use Headspace app',
  },
  {
    title: 'Maintain Daily Journal',
    label: '15 mins',
    tags: [],
    description: 'Use Spreadsheet for now',
  },
  {
    title: 'Go Trekking',
    label: '15 mins',
    tags: [
      { name: 'Info', color: 'info' },
      { name: 'Success', color: 'positive' },
    ],
    description: 'Completed 10km on cycle',
  },
];

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost',
  };
});

const getHeight = computed(() => {
  return +size.value.height - 90 + 'px';
});

const task_selected_index = ref({
  blocked: ref(null),
  completed: ref(null),
  planned: ref(null),
  wip: ref(null),
});
const thumbStyle = ref({
  right: '4px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: 0.75,
});
const add_model = ref({
  blocked: false,
  completed: false,
  planned: false,
  wip: false,
});
const add_data = ref({
  blocked: {},
  completed: {},
  planned: {},
  wip: {},
});
const barStyle = ref({
  right: '2px',
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '9px',
  opacity: 0.2,
});

const deleteTask = (name: string, index: number) => {
  if (name == 'panned') {
    planned_task.splice(index, 1);
  }
  if (name == 'wip') {
    wip_task.splice(index, 1);
  }
  if (name == 'completed') {
    completed_task.splice(index, 1);
  }
  if (name == 'blocked') {
    blocked_task.splice(index, 1);
  }
};
const onResize = (size_dynamic: { width: string; height: string }) => {
  size.value = size_dynamic;
};

//* methods
const log = (evt: any) => {
  window.console.log(evt);
};
</script>
<template>
  <HeaderBoard />
  <!-- <div class="row q-col-gutter-sm">
    <div class="col-3">
      <div class="text-h6">Identificacion</div>
      <Draggable
        class="list-group"
        :list="list1"
        group="people"
        @change="log"
        itemKey="name"
      >
        <template #item="{ element, index }">
          <q-card class="my-card q-mt-sm">
            <q-card-section>
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">{{ element.name }}</div>
            </q-card-section>
            <q-card-section class="text-caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
              {{ index }}
            </q-card-section>
          </q-card>
        </template>
      </Draggable>
    </div>
    <div class="col-3">
      <div class="text-h6">Cotizacion</div>
      <Draggable
        class="list-group"
        :list="list2"
        group="people"
        @change="log"
        itemKey="name"
      >
        <template #item="{ element, index }">
          <q-card class="my-card q-mt-sm">
            <q-card-section>
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">{{ element.name }}</div>
            </q-card-section>
            <q-card-section class="text-caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
              {{ index }}
            </q-card-section>
          </q-card>
        </template>
      </Draggable>
    </div>
  </div> -->
  <div class="row q-mt-xs" group="columns">
    <div class="col-3 rounded-borders q-px-xs">
      <q-card class="q-pa-xs custom_bg">
        <q-item
          style="cursor: move"
          class="q-pa-none text-white q-pa-sm rounded-borders"
        >
          <q-item-section class="text-h6 text-weight-bolder text-color"
            >PLANNED TASKS</q-item-section
          >
          <q-item-section avatar>
            <q-icon name="more_vert" class="cursor-pointer">
              <q-menu transition-show="fade" transition-hide="fade">
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>Remove</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 1</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 2</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </q-item>
        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          :style="{ height: getHeight }"
          class="col"
          ref="first"
        >
          <Draggable
            class="list-group"
            :list="planned_task"
            group="tasks"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <template>
              <q-card
                v-for="(item, index) in planned_task"
                v-bind:key="index"
                class="rounded-borders q-my-sm"
                @mouseover="$set(task_selected_index, 'planned', index)"
                @mouseleave="task_selected_index.planned = null"
              >
                <q-card-section class="row q-pa-sm">
                  <div class="col-12">
                    <span class="text-weight-bold text-h6 q-ml-sm">{{
                      item.title
                    }}</span>
                    <span class="float-right text-grey-8 q-mt-sm"
                      >{{ item.label }}
                      <q-icon
                        filled
                        size="xs"
                        name="close"
                        class="absolute-top-right q-mr-md q-mt-xs text-red"
                        v-if="index == task_selected_index.planned"
                        @click="
                          deleteTask('panned', task_selected_index.planned)
                        "
                      />
                    </span>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-chip
                    dense
                    v-for="(tag, index) in item.tags"
                    :key="index"
                    :color="tag.color"
                    text-color="white"
                  >
                    {{ tag.name }}
                  </q-chip>
                </q-card-section>
                <q-card-section class="q-pa-sm text-grey-8">
                  {{ item.description }}
                </q-card-section>
              </q-card>
            </template>
          </Draggable>

          <q-card class="full-width" v-if="add_model.planned">
            <q-card-section>
              <div class="text-h6">Add Task</div>
            </q-card-section>
            <q-card-section class="q-pa-sm">
              <q-input
                dense
                v-model="add_data.planned.title"
                label="Title"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.planned.label"
                label="Label"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.planned.description"
                label="Description"
                outlined
              />
            </q-card-section>
            <q-card-actions align="right" class="q-pa-sm text-grey-8">
              <q-btn
                label="Add"
                color="indigo-5"
                class="text-capitalize"
              ></q-btn>
              <q-btn
                label="Cancel"
                color="primary"
                class="text-capitalize"
                @click="add_model.planned = false"
              ></q-btn>
            </q-card-actions>
          </q-card>
          <q-item v-else>
            <q-btn
              icon="add"
              rounded
              flat
              label="Add Task"
              @click="add_model.planned = true"
            />
          </q-item>
        </q-scroll-area>
      </q-card>
    </div>

    <div class="col-3 q-px-xs">
      <q-card class="q-pa-xs custom_bg">
        <q-item style="cursor: move" class="q-pa-none text-white q-pa-sm">
          <q-item-section class="text-h6 text-weight-bolder text-color"
            >WORK IN PROGRESS</q-item-section
          >
          <q-item-section avatar>
            <q-icon name="more_vert" class="cursor-pointer">
              <q-menu transition-show="fade" transition-hide="fade">
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>Remove</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 1</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 2</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </q-item>
        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          :style="{ height: getHeight }"
          class="col"
          ref="first"
        >
          <Draggable
            class="list-group"
            :list="wip_task"
            group="tasks"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <q-card
              v-for="(item, index) in wip_task"
              v-bind:key="index"
              class="rounded-borders q-my-sm"
              @mouseover="task_selected_index.wip = index"
              @mouseleave="task_selected_index.wip = null"
            >
              <q-card-section class="row q-pa-sm">
                <div class="col-12">
                  <span class="text-weight-bold text-h6 q-ml-sm">{{
                    item.title
                  }}</span>
                  <span class="float-right text-grey-8 q-mt-sm"
                    >{{ item.label }}
                    <q-icon
                      filled
                      size="xs"
                      name="close"
                      class="absolute-top-right q-mr-md q-mt-xs text-red"
                      v-if="index == task_selected_index.wip"
                      @click="deleteTask('wip', task_selected_index.wip)"
                    />
                  </span>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-chip
                  dense
                  v-for="(tag, index) in item.tags"
                  :key="index"
                  :color="tag.color"
                  text-color="white"
                >
                  {{ tag.name }}
                </q-chip>
              </q-card-section>
              <q-card-section class="q-pa-sm text-grey-8">
                {{ item.description }}
              </q-card-section>
            </q-card>
          </Draggable>

          <q-card class="full-width" v-if="add_model.wip">
            <q-card-section>
              <div class="text-h6">Add Task</div>
            </q-card-section>
            <q-card-section class="q-pa-sm">
              <q-input
                dense
                v-model="add_data.wip.title"
                label="Title"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.wip.label"
                label="Label"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.wip.description"
                label="Description"
                outlined
              />
            </q-card-section>
            <q-card-actions align="right" class="q-pa-sm text-grey-8">
              <q-btn
                label="Add"
                color="indigo-5"
                class="text-capitalize"
              ></q-btn>
              <q-btn
                label="Cancel"
                color="primary"
                class="text-capitalize"
                @click="add_model.wip = false"
              ></q-btn>
            </q-card-actions>
          </q-card>
          <q-item v-else>
            <q-btn
              icon="add"
              rounded
              flat
              label="Add Task"
              @click="add_model.wip = true"
            />
          </q-item>
        </q-scroll-area>
      </q-card>
    </div>

    <div class="col-3 q-px-xs">
      <q-card class="q-pa-xs custom_bg2">
        <q-item style="cursor: move" class="q-pa-none text-white q-pa-sm">
          <q-item-section class="text-h6 text-weight-bolder text-color"
            >BLOCKED
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="more_vert" class="cursor-pointer">
              <q-menu transition-show="fade" transition-hide="fade">
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>Remove</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 1</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 2</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </q-item>

        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          :style="{ height: getHeight }"
          class="col"
          ref="first"
        >
          <Draggable
            class="list-group"
            :list="blocked_task"
            group="tasks"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <q-card
              v-for="(item, index) in blocked_task"
              v-bind:key="index"
              class="rounded-borders q-my-sm"
              @mouseover="task_selected_index.blocked = index"
              @mouseleave="task_selected_index.blocked = null"
            >
              <q-card-section class="row q-pa-sm">
                <div class="col-12">
                  <span class="text-weight-bold text-h6 q-ml-sm">{{
                    item.title
                  }}</span>
                  <span class="float-right text-grey-8 q-mt-sm"
                    >{{ item.label }}

                    <q-icon
                      filled
                      size="xs"
                      name="close"
                      class="absolute-top-right q-mr-md q-mt-xs text-red"
                      v-if="index == task_selected_index.blocked"
                      @click="
                        deleteTask('blocked', task_selected_index.blocked)
                      "
                    />
                  </span>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-chip
                  dense
                  v-for="(tag, index) in item.tags"
                  :key="index"
                  :color="tag.color"
                  text-color="white"
                >
                  {{ tag.name }}
                </q-chip>
              </q-card-section>
              <q-card-section class="q-pa-sm text-grey-8">
                {{ item.description }}
              </q-card-section>
            </q-card>
          </Draggable>
          <q-card class="full-width" v-if="add_model.blocked">
            <q-card-section>
              <div class="text-h6">Add Task</div>
            </q-card-section>
            <q-card-section class="q-pa-sm">
              <q-input
                dense
                v-model="add_data.blocked.title"
                label="Title"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.blocked.label"
                label="Label"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.blocked.description"
                label="Description"
                outlined
              />
            </q-card-section>
            <q-card-actions align="right" class="q-pa-sm text-grey-8">
              <q-btn
                label="Add"
                color="indigo-5"
                class="text-capitalize"
              ></q-btn>
              <q-btn
                label="Cancel"
                color="primary"
                class="text-capitalize"
                @click="add_model.blocked = false"
              ></q-btn>
            </q-card-actions>
          </q-card>
          <q-item v-else>
            <q-btn
              icon="add"
              rounded
              flat
              label="Add Task"
              @click="add_model.blocked = true"
            />
          </q-item>
        </q-scroll-area>
      </q-card>
    </div>

    <div class="col-3 q-px-xs">
      <q-card class="q-pa-xs custom_bg2">
        <q-item style="cursor: move" class="q-pa-none text-white q-pa-sm">
          <q-item-section class="text-h6 text-weight-bolder text-color"
            >COMPLETED
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="more_vert" class="cursor-pointer">
              <q-menu transition-show="fade" transition-hide="fade">
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>Remove</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 1</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Option 2</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </q-item>

        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          :style="{ height: getHeight }"
          class="col"
          ref="first"
        >
          <Draggable
            class="list-group"
            :list="completed_task"
            group="tasks"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <q-card
              v-for="(item, index) in completed_task"
              v-bind:key="index"
              class="rounded-borders q-my-sm"
              @mouseover="task_selected_index.completed = index"
              @mouseleave="task_selected_index.completed = null"
            >
              <q-card-section class="row q-pa-sm">
                <div class="col-12">
                  <span class="text-weight-bold text-h6 q-ml-sm">{{
                    item.title
                  }}</span>
                  <span class="float-right text-grey-8 q-mt-sm"
                    >{{ item.label }}
                    <q-icon
                      filled
                      size="xs"
                      name="close"
                      class="absolute-top-right q-mr-md q-mt-xs text-red"
                      v-if="index == task_selected_index.completed"
                      @click="
                        deleteTask('completed', task_selected_index.completed)
                      "
                    />
                  </span>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-chip
                  dense
                  v-for="(tag, index) in item.tags"
                  :key="index"
                  :color="tag.color"
                  text-color="white"
                >
                  {{ tag.name }}
                </q-chip>
              </q-card-section>
              <q-card-section class="q-pa-sm text-grey-8">
                {{ item.description }}
              </q-card-section>
            </q-card>
          </Draggable>
          <q-card class="full-width" v-if="add_model.completed">
            <q-card-section>
              <div class="text-h6">Add Task</div>
            </q-card-section>
            <q-card-section class="q-pa-sm">
              <q-input
                dense
                v-model="add_data.completed.title"
                label="Title"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.completed.label"
                label="Label"
                outlined
              />
              <q-input
                dense
                class="q-mt-sm"
                v-model="add_data.completed.description"
                label="Description"
                outlined
              />
            </q-card-section>
            <q-card-actions align="right" class="q-pa-sm text-grey-8">
              <q-btn
                label="Add"
                color="indigo-5"
                class="text-capitalize"
              ></q-btn>
              <q-btn
                label="Cancel"
                color="primary"
                class="text-capitalize"
                @click="add_model.completed = false"
              ></q-btn>
            </q-card-actions>
          </q-card>
          <q-item v-else>
            <q-btn
              icon="add"
              rounded
              flat
              label="Add Task"
              @click="add_model.completed = true"
            />
          </q-item>
        </q-scroll-area>
      </q-card>
    </div>
  </div>
  <q-resize-observer @resize="onResize" />
</template>

<style lang="scss">
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
