require('dotenv').config();
module.exports = {
    allowMimeType: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'image/svg'],
    profile_photo_url: process.env.HOST_URL + '/uploads/profileImage',
    project_photo_url: process.env.HOST_URL + '/uploads/projectImage',
    task_photo_url: process.env.HOST_URL + '/uploads/taskImage',
    broadcast_image_url : process.env.HOST_URL + '/uploads/images',
    broadcast_pdf_url : process.env.HOST_URL + '/uploads/pdf',
    passCode_for_password: 'PMToolAPI#RKw2ZH_LT769qaEkWhHH4w.anbyWQvJKuAy@2023',
    image_url: process.env.HOST_URL + 'uploads/images',
    profile_photo_url: process.env.HOST_URL + '/uploads/profileImage',
    aboutUs_image_url: process.env.HOST_URL + '/uploads/aboutUsImage',
    aboutUs_mission_image_url: process.env.HOST_URL + '/uploads/aboutUsMissionImage',
    aboutUs_teams_image_url: process.env.HOST_URL + '/uploads/aboutUsTeamsImage',
    home_expertise_image_url: process.env.HOST_URL + '/uploads/expertise',
    home_header_image_url: process.env.HOST_URL + '/uploads/header',
    home_keyPoint_image_url: process.env.HOST_URL + '/uploads/keyPoint',
    home_oneStepSolution_image_url: process.env.HOST_URL + '/uploads/oneStepSolution',
    home_startedExpert_image_url: process.env.HOST_URL + '/uploads/startedExpert',
    home_testimonial_image_url: process.env.HOST_URL + '/uploads/testimonial',
    identity_image:  '/uploads/identity',
    jwtAccessTokenOptions: {
        secret: 'URLShortner#@2024',
        options: {
            algorithm: 'HS256',
            expiresIn: '30d'
        }
    },
    jwtRefreshTokenOptions: {
        secret: 'URLShortner#@2024',
        options: {
            algorithm: 'HS256',
            expiresIn: '40d'
        }
    },
    cookieMaxAge: 30 * 24 * 60 * 60 * 1000
}