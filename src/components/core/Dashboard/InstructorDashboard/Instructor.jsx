import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

const Instructor = () => {
    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=>state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(()=> {
        const getCourseDataWithStats = async() => {
            setLoading(true);
            
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            console.log(instructorApiData);

            if(instructorApiData.length)
                setInstructorData(instructorApiData);

            if(result) {
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
    },[])

    const totalAmount = instructorData?.reduce((acc,curr)=> acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc,curr)=>acc + curr.totalStudentsEnrolled, 0);

  return (
    <div className='text-white'>
      <div>
        <h1>Hi {user?.firstName}</h1>
        <p>Let's start something new</p>
      </div>

      {loading ? (<div className='spinner'></div>)
      :courses.length > 0 
        ? (<div>
            <div>
            <div className='flex gap-1 items-center '>

             <div className='bg-richblack-800 w-1/2 items-center'>
                    <InstructorChart  courses={instructorData}/>
             </div>

                <div className='bg-richblack-800 w-1/2 items-center'>
                    <p>Statistics</p>
                    <div className='flex gap-2'>
                        <p>Total Courses</p>
                        <p>{courses.length}</p>
                    </div>

                    <div className='flex gap-2' >
                        <p>Total Students</p>
                        <p>{totalStudents}</p>
                    </div>

                    <div className='flex gap-2'>
                        <p>Total Income</p>
                        <p>{totalAmount}</p>
                    </div>
                </div>
            </div>
        </div>
        <div>
            {/* Render 3 courses */}
            <br />
            <div className='flex gap-2 '>
                <p>Your Courses</p>

                <div className='bg-yellow-50 text-richblack-900 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold'>
                <Link to="/dashboard/my-courses">
                    <p>View all</p>
                </Link>
                </div>
            </div>
            <div>
                {
                    courses.slice(0,3).map((course)=> (
                        <div>
                            <img 
                                src={course.thumbnail}
                            />
                            <div>
                                <p>{course.courseName}</p>
                                <div className='flex gap-2 '>
                                    <p>{course.studentsEnrolled.length} students</p>
                                    <p> | </p>
                                    <p className='text-yellow-5'> Rs {course.price}</p>
                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        </div>
        
        )
        :(<div className='flex flex-col '>
            <p>You have not created any courses yet</p>
            <Link to={"/dashboard/addCourse"}>
                Create a Course
            </Link>
        </div>)}
    </div>
  )
}

export default Instructor
