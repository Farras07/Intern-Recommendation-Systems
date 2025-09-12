import InternServices from '@/Services/InternServices';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternVacancyStreamHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  async GET() {
    return this._service.streamVacancyData();
  }
}
