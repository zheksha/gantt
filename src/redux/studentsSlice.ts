import {
  DaycareClasses,
  Status,
  type IChangeStatusPayload,
  type IStudent,
  type IStudentSliceState,
} from '@/types/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: IStudentSliceState = {
  students: [
    {
      id: 654321,
      firstName: 'Ilkhom',
      lastName: 'Abdullaev',
      parentEmail: 'ilkhom@gmail.com',
      age: 25,
      enrolledClass: DaycareClasses.PANDAS,
      pinCode: 1234,
      status: Status.DROPPED_OFF,
    },
  ],
}

const generatePin = (birthDate?: Date) => {
  const [month, day, year] = birthDate?.toString().split('/') || ''
  return Number(`${month}${day}${year.slice(-2)}`)
}

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action: PayloadAction<IStudent>) => {
      const pinCode = generatePin(action.payload.birthDate)
      state.students.push({
        ...action.payload,
        pinCode,
        id: Math.floor(100000 + Math.random() * 900000),
      })
    },
    changeStatus: (state, action: PayloadAction<IChangeStatusPayload>) => {
      const student = state.students.find(
        (student) => student.id === action.payload.id
      )
      if (student) {
        student.status = action.payload.status
        student.lastStatusUpdateTime = new Date().toLocaleString()
      }
      return state
    },
  },
})

// Action creators are generated for each case reducer function
export const { addStudent, changeStatus } = studentsSlice.actions

export default studentsSlice.reducer
