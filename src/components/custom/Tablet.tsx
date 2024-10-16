import { useEffect, useState } from 'react'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Delete } from 'lucide-react'
import { Status, type IStudent } from '@/types/types'
import { useAppDispatch } from '@/redux/store'
import { changeStatus } from '@/redux/studentsSlice'
import { toast } from 'sonner'

interface ITabletProps {
  students: IStudent[]
}

const Tablet = (props: ITabletProps) => {
  const { students } = props

  const [value, setValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedStudent, setSelectedStudent] = useState<IStudent>()
  const dispatch = useAppDispatch()

  // Handle input slot change
  const handleInputChange = (index, newValue) => {
    const otpArray = value.split('')
    otpArray[index] = newValue
    setValue(otpArray.join(''))
    if (index < 5 && newValue !== '') {
      setActiveIndex(index + 1) // move to next slot
    }
  }

  // Handle number click
  const handleNumberClick = (number: number) => {
    if (activeIndex < 6) {
      handleInputChange(activeIndex, number.toString())
    }
  }

  // Handle clearing one by one (like backspace)
  const handleClearLast = () => {
    if (activeIndex > 0 || value[activeIndex]) {
      let newActiveIndex = activeIndex
      const otpArray = value.split('')

      // Find the last filled slot if the current activeIndex is empty
      if (!value[activeIndex] && activeIndex > 0) {
        newActiveIndex = activeIndex - 1
      }

      otpArray[newActiveIndex] = '' // Clear the last filled slot
      setValue(otpArray.join(''))
      setActiveIndex(newActiveIndex) // Set focus to the cleared slot
      setSelectedStudent(undefined)
    }
  }

  useEffect(() => {
    if (value?.length === 6) {
      const filteredStudent = students.filter(
        (student) => student.id === Number(value)
      )
      setSelectedStudent(filteredStudent[0])
    }
  }, [value, students])

  const handleStatusChange = () => {
    if (selectedStudent) {
      dispatch(
        changeStatus({
          id: selectedStudent.id,
          status:
            selectedStudent.status === Status.DROPPED_OFF
              ? Status.PICKED_UP
              : Status.DROPPED_OFF,
        })
      )

      console.log(
        '%c[DEBUG]:',
        'color: red; background: yellow; font-weight: bold; padding: 2px;',
        'This is a debug message'
      )

      toast.success('Action has been recorded', {
        description: new Date().toLocaleString(),
        position: 'top-center',
      })

      setSelectedStudent(undefined)
      setValue('')
    }
  }

  return (
    <div className="space-y-2">
      {selectedStudent?.firstName ? (
        <div className="border flex justify-between items-center p-0 m-0">
          <p className="p-3">{selectedStudent?.firstName}</p>
          <div
            className="border-l p-2 self-stretch text-center align-middle justify-center flex items-center bg-slate-200 cursor-pointer"
            onClick={handleStatusChange}
          >
            {selectedStudent.status === Status.DROPPED_OFF
              ? 'Pick Up'
              : 'Drop Off'}
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                value={value[index] || ''}
                onFocus={() => setActiveIndex(index)}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <div
          onClick={handleClearLast} // Clear last input on click
          className="font-medium  px-3 border text-center items-center hover:bg-slate-200 flex  justify-center content-center cursor-pointer bg-slate-200"
        >
          <Delete color="#27272a" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-0 ">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number, index) => (
          <div
            key={number}
            onClick={() => handleNumberClick(number)} // Update OTP on click
            className={`font-medium border text-center hover:bg-slate-200 p-9 cursor-pointer ${
              index === 9 ? 'col-span-3 ' : ''
            }`}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  )
}

export { Tablet }
