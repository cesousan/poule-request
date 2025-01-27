import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { GitlabUser } from './auth.interface';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttp: jasmine.SpyObj<HttpClient>;

  const mockUser: GitlabUser = {
    id: 1,
    username: 'test_user',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg'
  };

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClient', ['get']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve token', () => {
    const testToken = 'test-token';
    service.setCredentials(testToken, 'test-org');
    expect(service.getToken()).toBe(testToken);
  });

  it('should store and retrieve organization ID', () => {
    const testOrgId = 'test-org-123';
    const testToken = 'test-token';
    
    service.setCredentials(testToken, testOrgId);
    
    expect(service.getOrganizationId()).toBe(testOrgId);
  });

  it('should clear token and organization ID on logout', () => {
    service.setCredentials('test-token', 'test-org');
    
    service.logout();
    
    expect(service.getOrganizationId()).toBeNull();
    expect(service.getToken()).toBeNull();
    expect(service.currentUser).toBeNull();
  });

  it('should load user and set credentials on login', (done) => {
    const token = 'test-token';
    const orgId = 'test-org';
    mockHttp.get.and.returnValue(of(mockUser));
    
    service.setCredentials('old-token', orgId);
    
    service.login(token, orgId).subscribe(() => {
      expect(service.currentUser).toEqual(mockUser);
      expect(service.getToken()).toBe(token);
      expect(service.getOrganizationId()).toBe(orgId);
      done();
    });

    expect(mockHttp.get).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/user',
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          get: jasmine.any(Function)
        })
      })
    );
  });

  it('should load user with token', (done) => {
    const token = 'test-token';
    mockHttp.get.and.returnValue(of(mockUser));

    service.loadUser(token).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser).toEqual(mockUser);
      done();
    });

    expect(mockHttp.get).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/user',
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          get: jasmine.any(Function)
        })
      })
    );
  });

  it('should expose currentUser$ as an observable', (done) => {
    const token = 'test-token';
    mockHttp.get.and.returnValue(of(mockUser));

    let emissionCount = 0;
    service.currentUser$.subscribe({
      next: (user) => {
        if (emissionCount === 0) {
          expect(user).toBeNull();
          emissionCount++;
          service.loadUser(token).subscribe();
        } else if (emissionCount === 1) {
          expect(user).toEqual(mockUser);
          done();
          emissionCount++;
        }
      },
      error: done.fail
    });
  });
}); 