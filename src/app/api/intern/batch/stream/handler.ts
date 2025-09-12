import InternServices from '@/Services/InternServices';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternBatchStreamHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }
  async GET() {
    return this._service.streamBatchData();
  }
}
