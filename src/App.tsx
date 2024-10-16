import './App.css'
import FeatureReleaseGanttChart from './components/custom/FeatureReleases'
import StudentList from './components/custom/StudentList'
import StudentsForm from './components/custom/StudentsForm'
import { Tablet } from './components/custom/Tablet'
import { useAppSelector } from './redux/store'

const App = () => {
  const students = useAppSelector((state) => state.studentsInfo.students)

  return (
    <div className="p-10 flex">
      {/* <div className="w-full h-screen flex justify-center items-center">
        <Tablet students={students} />
      </div> */}
      <FeatureReleaseGanttChart />

      {/* <div className="w-1/3 border border-slate-400 rounded-lg mr-2">
        <StudentsForm />
      </div>
      <div className="w-2/3 border border-slate-400 rounded-lg">
        <StudentList students={students} />
      </div> */}
    </div>
  )
}

export default App
