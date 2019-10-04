import Appointment from './AppointmentController';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is no a provider' });
    }
    return res.json();
  }
}

export default new ScheduleController();
