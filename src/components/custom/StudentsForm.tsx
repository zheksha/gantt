import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'
import { ComboBox } from './ComboBox'
import type { IStudent } from '@/types/types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import * as Yup from 'yup'
import { useAppDispatch } from '@/redux/store'
import { addStudent } from '@/redux/studentsSlice'
import { DatePicker } from './DatePicker'
import { format } from 'date-fns'

const StudentsForm = () => {

  const dispatch = useAppDispatch()

  const onHandleSubmit = (
    values: IStudent,
    { resetForm }: { resetForm: () => void }
  ) => {
    dispatch(addStudent(values))
    resetForm()
  }


  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[A-Za-z]+$/, 'Numbers cannot be a name')
      .min(2, 'Too Short!')
      .max(15, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(25, 'Too Long!')
      .required('Required'),
    parentEmail: Yup.string().email('Invalid email').required('Required'),
    age: Yup.number()
      .max(10, "Child's age exceeds daycare limitation")
      .min(1, 'Too young.'),
  })

  return (
    <div className="p-10">
      <h1>Enroll Student</h1>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          parentEmail: '',
          age: 0,
          enrolledClass: undefined,
          birthDate: undefined,
        }}
        onSubmit={onHandleSubmit}
        validationSchema={SignupSchema}
      >
        {({
          values,
          handleChange,
          handleBlur,
          setFieldValue,
          errors,
          touched,
        }) => (
          <Form>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mb-2"
            />
            {errors.firstName && touched.firstName ? (
              <Badge variant="destructive" className="block mb-5">
                {errors.firstName}
              </Badge>
            ) : null}

            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mb-2"
            />
            {errors.lastName && touched.lastName ? (
              <Badge variant="destructive" className="block mb-5">
                {errors.lastName}
              </Badge>
            ) : null}

            <Label htmlFor="parentEmail">Email</Label>
            <Input
              id="parentEmail"
              name="parentEmail"
              type="email"
              value={values.parentEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mb-2"
            />
            {errors.parentEmail && touched.parentEmail ? (
              <Badge variant="destructive" className="block mb-5">
                {errors.parentEmail}
              </Badge>
            ) : null}

            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mb-2"
            />
            {errors.age && touched.age ? (
              <Badge variant="destructive" className="block mb-5">
                {errors.age}
              </Badge>
            ) : null}

            <Label htmlFor="birthdate">Birth Date</Label>
            <DatePicker
              date={values.birthDate}
              setDate={(selectedDate) =>
                setFieldValue('birthDate', format(selectedDate, 'MM/dd/yyyy'))
              }
            />

            <Label htmlFor="enrolledClass" className="mt-5">
              Enroll to class
            </Label>
            <div>
              <ComboBox
                value={values.enrolledClass}
                setValue={(selectedvalue) =>
                  setFieldValue('enrolledClass', selectedvalue)
                }
              />
            </div>

            <div className="mt-5">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default StudentsForm
