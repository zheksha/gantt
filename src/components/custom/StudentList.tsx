import type { IStudent } from '@/types/types'
import React, { useMemo, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface IStudentListProps {
  students: IStudent[]
}

const StudentList = (props: IStudentListProps) => {
  const { students } = props
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = useMemo(() => {
    console.log('Filtering Student.....')
    return students.filter((student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="p-10">
      <Input
        id="age"
        name="age"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
        placeholder="Search for the student..."
      />
      <ul className="list-disc mt-2">
        {filteredStudents.map((student) => (
          <li className="text-sm mx-6">{student.firstName}</li>
        ))}
      </ul>
    </div>
  )
}

export default StudentList
