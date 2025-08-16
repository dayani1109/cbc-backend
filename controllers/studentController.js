import Student from '../models/student.js';
export async function getStudent(req,res){
    
            //read and get all student info from mongoDB database....use Student model
    
            // Student.find().then(
            //     (student)=>{
            //        res.json(
            //         student
            //        )
            //     }
            // ).catch(
            //     ()=>{
                    
            //     }
            // )

            //kalim vidiyt liyannth puluvam me vidiyt liyannath puluvam
        try{
            const students = await Student.find();
            res.json(student);

        }catch(err){
            console.error(err);

            res.status(500).json({
                message : "Failed to retrieve students"
            })
        }
            

}

export function createStudent(req,res){
    
    //check karanav user kenek innvd nadd kiyala
    if(req.user == null){//user nathnm
        res.status(401).json({
            message : "please login and try again"
        })
        return // me function ek methanim ehata run venne na user kenek idiye nathnm
    }

    if(req.user.role != "admin"){//check karanva user role ek admin nemed kiyala
        res.status(403).json({//status code ek 403
            message : "you must be an admin to create a student"
        })
        return
    }

        //me 's'tudent venam student variable ekk, 'S'tudent kiyanne model ek
        const student = new Student(
            {
                name: req.body.name,
                age: req.body.age,
                city: req.body.city
            }
        )
        student.save().then(
            ()=>{
                res.json({
                    message: "Student created successfully"
                })
            }
        ).catch(
             ()=>{
                res.json({
                    message: "Student created Fail"
                })
            }
        )
    }