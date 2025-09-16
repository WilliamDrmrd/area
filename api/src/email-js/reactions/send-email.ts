import { Injectable } from '@nestjs/common';
import { ServicesCredentials } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ReactionInterface, ReactionAbstract, Option } from '../../types';
import EmailJS from '@emailjs/nodejs';

const serviceId = process.env['EMAILJS_SERVICE_ID'];
const templateId = process.env['EMAILJS_TEMPLATE_ID'];
const publicKey = process.env['EMAILJS_PUBLIC_KEY'];
const privateKey = process.env['EMAILJS_PRIVATE_KEY'];

@Injectable()
export class SendEmail extends ReactionAbstract implements ReactionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'Send-Email', 'Send-Email', {
      firstname: 'your first name',
      lastname: 'your last name',
      email: 'the email adress you want to send to',
    });
  }

  async execute(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ) {
    userCredentials as ServicesCredentials;

    if (
      !data[0].data['object'] ||
      !options['firstname'] ||
      !options['lastname'] ||
      !options['email'] ||
      !data[0].data['message']
    ) {
      throw new Error(`Missing parameters`);
    }

    await this.sendEmail(
      data[0].data['object'],
      options['firstname'],
      options['lastname'],
      options['email'],
      data[0].data['message'],
    );
    return false;
  }

  async sendEmail(
    object: string,
    firstname: string,
    lastname: string,
    email: string,
    message: string,
  ) {
    try {
      const response = await EmailJS.send(
        serviceId,
        templateId,
        {
          object: object,
          firstname: firstname,
          lastname: lastname,
          email: email,
          message: message,
        },
        { publicKey: publicKey, privateKey: privateKey },
      );
      response.status === 200
        ? console.log('email sent to ' + email + ' with success')
        : console.log('email not sent to ' + email);
      return response.status === 200;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async confirmationMail(email: string, name: string, uuid: string) {
    try {
      const response = await EmailJS.send(
        serviceId,
        'template_9yd32el',
        {
          object: name,
          email: email,
          message: `http://localhost:3000/auth/${uuid}/activate`,
        },
        { publicKey: publicKey, privateKey: privateKey },
      );
      response.status === 200
        ? console.log('email sent to ' + email + ' with success')
        : console.log('email not sent to ' + email);
      return response.status === 200;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default SendEmail;
