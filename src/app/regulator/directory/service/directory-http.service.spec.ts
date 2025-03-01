import { TestBed } from '@angular/core/testing';
import { DirectoryHttpService } from './directory-http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DirectoryHttpService', () => {
  let service: DirectoryHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Provides a mock HttpClient
      providers: [DirectoryHttpService],  // Ensure the service is available
    });
    service = TestBed.inject(DirectoryHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
