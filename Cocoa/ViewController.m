#import "ViewController.h"
#import "JavaScriptController.h"
#import <Foundation/Foundation.h>

@implementation ViewController
- (void) viewDidLoad {
		[JavaScriptController require: @"main"];
}
@end
