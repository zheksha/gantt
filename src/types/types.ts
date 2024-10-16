export enum DaycareClasses {
  LIONS = 'Lions',
  TIGERS = 'Tigers',
  KOALAS = 'Koalas',
  PANDAS = 'Pandas',
  MONKEYS = 'Monkeys',
  ELEPHANTS = 'Elephants',
}

export enum Status {
  PICKED_UP = 'picked_up',
  DROPPED_OFF = 'dropped_off',
}

export interface IStudent {
  id?: number
  firstName?: string
  lastName: string
  parentEmail: string
  age: number
  enrolledClass?: DaycareClasses
  birthDate?: Date
  pinCode?: number
  status?: Status
  lastStatusUpdateTime?: string
}

export interface IStudentSliceState {
  students: IStudent[]
}

export interface IChangeStatusPayload {
  id: Pick<IStudent, 'id'>
  status: Status
}
